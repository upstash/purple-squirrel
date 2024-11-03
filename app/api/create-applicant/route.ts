import { Index } from "@upstash/vector";
import type { NextRequest } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { Applicant } from "@/types";

export const runtime = "edge";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const mailData = body.mailData;

  console.log("PIPELINE: Fetching OpenAI Parsing Response");

  const userMessage = `MAIL_SUBJECT\n${mailData.mailSubject}\n\nMAIL_FROM\n${mailData.mailFrom}\n\nMAIL_BODY\n${mailData.mailBody}\n\nRESUME_TEXT\n${mailData.resumeText}`;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: SYSTEM_MESSAGE,
      },
      { role: "user", content: userMessage },
    ],
    model: "gpt-4o-mini",
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

  const applicant: Applicant = {
    id: uuidv4(),
    name: parsedMailData.name,
    location: parsedMailData.location,
    position: parsedMailData.position,
    resumeUrl: mailData.resumeUrl,
    coverLetter: parsedMailData.coverLetter,
    favorite: false,
    archived: false,
    notes: "",
  };

  await index.upsert({
    id: applicant.id,
    data: `RESUME: ${mailData.resumeText}\n\nCOVER_LETTER: ${applicant.coverLetter}`,
    metadata: applicant,
  });

  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";

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
    "name": <name>,
    "location": <location>,
    "position": <position>,
    "coverLetter": <cover-letter>,
}
Some information can be taken from the email information along with the resume.
All the values are strings.
If the information is not available in the text, put null.
Below are information about the key value pairs.

"name" is the full name of the applicant.
"location" is the estimated location of the applicant.
"position" is the position the applicant is applying to. If it exists in the MAIL_SUBJECT, take it directly from there. If not, you can put the latest or the best describing position.
"coverLetter" is the cover letter/note or any statement of intention from the applicant, it must be taken from the MAIL_BODY if applicable.`;
