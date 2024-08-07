import { Redis } from "@upstash/redis";
import { Index } from "@upstash/vector";
import { Receiver } from "@upstash/qstash";
import type { NextRequest } from "next/server";
import OpenAI from "openai";
import type { ApplicantData, ApplicantMetadata } from "@/types";
import QSTASH_TARGET_URL from "@/app/utils/qstash-target-url";
import { isCountryCode } from "@/types/validations";
const levenshtein = require("js-levenshtein");

export const runtime = "edge";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string,
});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_MESSAGE = `You are a resume parser.
You will be presented information in the following format:
MAIL_SUBJECT
<mail-subject>

MAIL_FROM
<mail-from>

MAIL_BODY
<mail-body>

RESUME_TEXT
<resume-text>

You will give nothing but the JSON like below:
{
    "basicInfo": {
        "fullName": <full-name>,
        "email": <email>,
        "phone": <phone>,
        "websiteUrl": <website-url>,
        "linkedinUrl": <linkedin-url>,
        "githubUrl": <github-url>,
        "cover": <cover>
    },
    "manualFilters": {
        "yoe": <yoe>,
        "position": <position>,
        "countryCode": <country-code>
    }
}
Some information can be taken from the email information along with the resume.
All the values are strings except yoe which is an integer.
If the information is not available in the text, put null.
Below are information about the key value pairs.

"basicInfo" is an object consisting of basic information about the applicant. You can format the information when you put them here with correct capitalization.
"fullName", "age", "email", "phone", "websiteUrl", "linkedinUrl", "githubUrl" are self explanatory.
"cover" is the cover letter/note or any statement of intention from the applicant, it must be taken from the MAIL_BODY if applicable.

"manualFilters" are critical information that the applicant will be filtered on.
"yoe" is the years of experience of the applicant in an industrial sense. For example: work experience and research experience should be counted but personal hobby projects or education should not be counted. If the information is already presented it in the resume take it, otherwise calculate yourself.
"position" is the position the applicant is applying to such as Senior Software Engineer. If it exists in the MAIL_SUBJECT, take it directly from there. If not, you can put the latest or the best describing position.
"countryCode" is the Alpha-2 code of the country in which the applicant lives, you can guess it based on the resume. Do not put more than one country code since it will be exact matched.`;

const TEST_MESSAGE = `You are a resume parser.
You will be presented information in the following format:
MAIL_SUBJECT
<mail-subject>

MAIL_BODY
<mail-body>

RESUME_TEXT
<resume-text>

You will give nothing but the JSON like below:
{
    "basicInfo": {
        "fullName": <full-name>,
        "email": <email>,
        "phone": <phone>,
        "websiteUrl": <website-url>,
        "linkedinUrl": <linkedin-url>,
        "githubUrl": <github-url>,
        "cover": <cover>
    },
    "manualFilters": {
        "yoe": <yoe>,
        "position": <position>,
        "countryCode": <country-code>
    }
}
Some information can be taken from the email information along with the resume.
All the values are strings except yoe which is an integer.
If the information is not available in the text, put null.
Below are information about the key value pairs.

"basicInfo" is an object consisting of basic information about the applicant. You can format the information when you put them here with correct capitalization.
"fullName", "age", "email", "phone", "websiteUrl", "linkedinUrl", "githubUrl" are self explanatory.
"cover" is the cover letter/note or any statement of intention from the applicant, it must be taken from the MAIL_BODY if applicable.

"manualFilters" are critical information that the applicant will be filtered on.
"yoe" is the years of experience of the applicant in an industrial sense. For example: work experience and research experience should be counted but personal hobby projects or education should not be counted. If the information is already presented it in the resume take it, otherwise calculate yourself.
"position" is the position the applicant is applying to such as Senior Software Engineer. If it exists in the MAIL_SUBJECT, take it directly from there. If not, you can put the latest or the best describing position.
"countryCode" is the Alpha-2 code of the country in which the applicant lives, you can guess it based on the resume. Do not put more than one country code since it will be exact matched.`;

function positionMatch(position: string, positions: any) {
  const trimmedPosition = position.toLowerCase().trim();
  const exactMatch = positions.find((pos: any) => {
    pos.name.toLowerCase().trim() === trimmedPosition;
  });
  if (exactMatch) {
    if (exactMatch.status === "open") {
      return exactMatch.id;
    } else {
      return "General Application";
    }
  }

  let bestMatch = positions[0];
  let bestMatchDistance = levenshtein(positions[0].name, position);
  for (let i = 1; i < positions.length; i++) {
    const distance = levenshtein(positions[i].name, position);
    if (distance < bestMatchDistance) {
      bestMatch = positions[i];
      bestMatchDistance = distance;
    }
  }
  if (bestMatch.status === "open") {
    return bestMatch.id;
  } else {
    return 1;
  }
}

function mailDataToApplicant(
  mailData: any,
  parsedMailData: any,
  positions: any,
  date: Date
) {
  if (!parsedMailData.hasOwnProperty("basicInfo")) {
    console.log("PIPELINE: OpenAI Parsing fields missing");
    return { applicant: null, fullResumeText: null, mapStatus: false };
  }
  let yoe;
  let position;
  let countryCode;
  if (parsedMailData.hasOwnProperty("manualFilters")) {
    yoe = parsedMailData.manualFilters.hasOwnProperty("yoe")
      ? parsedMailData.manualFilters.yoe
      : null;
    position = parsedMailData.manualFilters.hasOwnProperty("position")
      ? parsedMailData.manualFilters.position
      : null;
    countryCode = parsedMailData.manualFilters.hasOwnProperty("countryCode")
      ? parsedMailData.manualFilters.countryCode
      : null;
  } else {
    yoe = null;
    position = null;
    countryCode = null;
  }
  const fullName = parsedMailData.basicInfo.hasOwnProperty("fullName")
    ? parsedMailData.basicInfo.fullName
    : null;
  const cover = parsedMailData.basicInfo.hasOwnProperty("cover")
    ? parsedMailData.basicInfo.cover
    : null;
  const email = parsedMailData.basicInfo.hasOwnProperty("email")
    ? parsedMailData.basicInfo.email
    : null;
  const phone = parsedMailData.basicInfo.hasOwnProperty("phone")
    ? parsedMailData.basicInfo.phone
    : null;
  const websiteUrl = parsedMailData.basicInfo.hasOwnProperty("websiteUrl")
    ? parsedMailData.basicInfo.websiteUrl
    : null;
  const linkedinUrl = parsedMailData.basicInfo.hasOwnProperty("linkedinUrl")
    ? parsedMailData.basicInfo.linkedinUrl
    : null;
  const githubUrl = parsedMailData.basicInfo.hasOwnProperty("githubUrl")
    ? parsedMailData.basicInfo.githubUrl
    : null;

  if (!fullName) {
    console.log("PIPELINE: OpenAI Parsing fields missing");
    return { applicant: null, fullResumeText: null, mapStatus: false };
  }
  const positionId = position ? positionMatch(position, positions) : 1;
  const applicantData: ApplicantData = {
    applicantInfo: {
      name: fullName,
      cover: cover,
      contact: {
        email: email,
        phone: phone,
      },
      urls: {
        website: websiteUrl,
        linkedin: linkedinUrl,
        github: githubUrl,
      },
      notes: "",
    },
    positionId: positionId,
    resumeInfo: {
      uploadthing: {
        url: mailData.resumeUrl,
        key: mailData.resumeKey,
      },
      fullText: mailData.resumeText,
    },
  };
  const applicantMetadata: ApplicantMetadata = {
    countryCode: isCountryCode(countryCode) ? countryCode : undefined,
    status: "newApply",
    stars: 0,
    yoe: yoe || -1,
  };
  return {
    positionId: position ? positionMatch(position, positions) : 1,
    applicantData: applicantData,
    applicantMetadata: applicantMetadata,
    fullResumeText: mailData.resumeText,
    mapStatus: true,
  };
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get("Upstash-Signature");
  const body = await req.json();

  if (!signature) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const isValid = await receiver.verify({
    body: JSON.stringify(body),
    signature,
    url: `${QSTASH_TARGET_URL}/api/mail-pipeline/create-applicant`,
  });

  if (!isValid) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const methodsValue = await redis.get("application:methods");
  if (
    !methodsValue ||
    !Array.isArray(methodsValue) ||
    !methodsValue.includes("mail")
  ) {
    return Response.json({
      status: 500,
      message: "Mail method not enabled",
    });
  }
  const mailData = body.mailData;

  const date = new Date();

  const positionsResponse = await redis.lrange("positions", 0, -1);
  const positions =
    positionsResponse.length === 0
      ? [{ name: "General Application", status: "open" }]
      : positionsResponse;

  console.log("PIPELINE: Fetching OpenAI Parsing Response");

  const prodUserMessage = `MAIL_SUBJECT\n${mailData.mailSubject}\n\nMAIL_FROM\n${mailData.mailFrom}\n\nMAIL_BODY\n${mailData.mailBody}\n\nRESUME_TEXT\n${mailData.resumeText}`;
  const testUserMessage = `MAIL_SUBJECT\n${mailData.mailSubject}\n\nMAIL_BODY\n${mailData.mailBody}\n\nRESUME_TEXT\n${mailData.resumeText}`;
  const test_mode = false;
  let systemMessage;
  let userMessage;
  if (test_mode) {
    systemMessage = TEST_MESSAGE;
    userMessage = testUserMessage;
    console.log("PIPELINE: Test Mode Active");
  } else {
    systemMessage = SYSTEM_MESSAGE;
    userMessage = prodUserMessage;
  }
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      { role: "user", content: userMessage },
    ],
    model: "gpt-3.5-turbo-0125",
    response_format: { type: "json_object" },
  });
  if (completion.choices[0].finish_reason === "length") {
    console.log("PIPELINE: OpenAI Parsing Length Error");
    return;
  }
  if (!completion.choices[0].message.content) {
    console.log("PIPELINE: OpenAI Parsing No Content Error");
    return;
  }

  const parsedMailData = JSON.parse(completion.choices[0].message.content);

  const mapResult = mailDataToApplicant(
    mailData,
    parsedMailData,
    positions,
    date
  );
  const mapStatus = mapResult.mapStatus;
  if (!mapStatus) {
    console.log("PIPELINE: OpenAI Parsed Data Does Not Fit Applicant Schema");
    return;
  }
  const applicantData = mapResult.applicantData;
  if (!applicantData) {
    console.log("PIPELINE: OpenAI Parsed Data Error");
    return;
  }
  const fullResumeText = mapResult.fullResumeText;
  if (!fullResumeText) {
    console.log("PIPELINE: OpenAI Parsed Data Error");
    return;
  }

  const positionId = mapResult.positionId;
  if (!positionId) {
    console.log("PIPELINE: OpenAI Parsed Data Error");
    return;
  }

  console.log("PIPELINE: Fetching OpenAI Embedding Response");
  const resumeEmbeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: fullResumeText,
    encoding_format: "float",
  });

  const resumeEmbedding = resumeEmbeddingResponse.data[0].embedding;

  let applicantID = await redis.lpop("free:ids");
  if (!applicantID) {
    applicantID = await redis.incr("applicant:id:generator");
  }
  const existenceCheck = await redis.exists(`applicant#${applicantID}`);
  if (existenceCheck === 1) {
    return Response.json({ status: 500, message: "Applicant ID Collusion" });
  }

  await redis.json.set(
    `applicant#${applicantID}`,
    "$",
    JSON.stringify(applicantData)
  );

  const namespace = index.namespace(`${positionId}`);

  await namespace.upsert({
    id: `${applicantID}_application`,
    vector: resumeEmbedding,
    metadata: mapResult.applicantMetadata,
  });
  
  await redis.sadd(`position#${positionId}:ids`, applicantID);
  await redis.lpush('latest:applicants', { id: applicantID, positionId: positionId });
  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
