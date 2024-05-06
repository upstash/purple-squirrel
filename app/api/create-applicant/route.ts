import { Redis } from '@upstash/redis';
import { Index } from "@upstash/vector";
import type { NextRequest } from 'next/server';
import OpenAI from "openai";
import type { Applicant } from '@/types/types';
import { headers } from 'next/headers'
import BASE_URL from '@/app/utils/baseURL';
import { locationLookup } from "@/app/utils/locations";
const levenshtein = require('js-levenshtein');

export const runtime = "edge";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
})

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
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
        "age": <age>,
        "university": <university>,
        "email": <email>,
        "phone": <phone>,
        "websiteUrl": <website-url>,
        "linkedinUrl": <linkedin-url>,
        "githubUrl": <github-url>
    },
    "manualFilters": {
        "yoe": <yoe>,
        "position": <position>,
        "country": <country>,
        "highestDegree": <highest-degree>,
        "degreeSubject": <degree-subject>,
        "graduationYear": <graduation-year>,
        "graduationMonth": <graduation-month>
    }
}
Some information can be taken from the email information along with the resume.
All the values are strings except age, yoe, graduation-year and graduation-month which are integers.
If the information is not available in the text, put null.
Below are information about the key value pairs.

"basicInfo" is an object consisting of basic information about the applicant. You can format the information when you put them here with correct capitalization.
"fullName", "age", "email", "phone", "websiteUrl", "linkedinUrl", "githubUrl" are self explanatory.
"university" is the latest university that the applicant got their degree in.

"manualFilters" are critical information that the applicant will be filtered on.
"yoe" is the years of experience of the applicant in an industrial sense. For example: work experience and research experience should be counted but personal hobby projects or education should not be counted. If the information is already presented it in the resume take it, otherwise calculate yourself.
"position" is the position the applicant is applying to such as Senior Software Engineer. If it exists in the MAIL_SUBJECT, take it directly from there. If not, you can put the latest or the best describing position.
"countryCode" is the Alpha-2 code of the country in which the applicant lives, you can guess it based on the resume. Do not put more than one country code since it will be exact matched.
"highestDegree" is highest degree applicant achieved or pursuing. It can be "Unknown", "No Degree", "Associate's", "Bachelor's", "Master's" or "Doctoral".
"degreeSubject" is the subject of the highest degree such as Computer Science.
"graduationYear" is the year the applicant graduated or will graduate.
"graduationMonth" is the month the applicant graduated or will graduate. It must be an integer between 1 and 12 inclusive representing the month.`;

const TEST_MESSAGE = `You are a resume parser.
You will be presented information in the following format:
MAIL_SUBJECT
<mail-subject>

RESUME_TEXT
<resume-text>

You will give nothing but the JSON like below:
{
    "basicInfo": {
        "fullName": <full-name>,
        "age": <age>,
        "university": <university>,
        "email": <email>,
        "phone": <phone>,
        "websiteUrl": <website-url>,
        "linkedinUrl": <linkedin-url>,
        "githubUrl": <github-url>
    },
    "manualFilters": {
        "yoe": <yoe>,
        "position": <position>,
        "countryCode": <country-code>,
        "highestDegree": <highest-degree>,
        "degreeSubject": <degree-subject>,
        "graduationYear": <graduation-year>,
        "graduationMonth": <graduation-month>
    }
}
Some information can be taken from the email information along with the resume.
All the values are strings except age, yoe, graduation-year and graduation-month which are integers.
If the information is not available in the text, put null.
Below are information about the key value pairs.

"basicInfo" is an object consisting of basic information about the applicant. You can format the information when you put them here with correct capitalization.
"fullName", "age", "email", "phone", "websiteUrl", "linkedinUrl", "githubUrl" are self explanatory.
"university" is the latest university that the applicant got their degree in.

"manualFilters" are critical information that the applicant will be filtered on.
"yoe" is the years of experience of the applicant in an industrial sense. For example: work experience and research experience should be counted but personal hobby projects or education should not be counted. If the information is already presented it in the resume take it, otherwise calculate yourself.
"position" is the position the applicant is applying to such as Senior Software Engineer. If it exists in the MAIL_SUBJECT, take it directly from there. If not, you can put the latest or the best describing position.
"countryCode" is the Alpha-2 code of the country in which the applicant lives, you can guess it based on the resume. Do not put more than one country code since it will be exact matched.
"highestDegree" is highest degree applicant achieved or pursuing. It can be "Unknown", "No Degree", "Associate's", "Bachelor's", "Master's" or "Doctoral".
"degreeSubject" is the subject of the highest degree such as Computer Science.
"graduationYear" is the year the applicant graduated or will graduate.
"graduationMonth" is the month the applicant graduated or will graduate. It must be an integer between 1 and 12 inclusive representing the month.`;

function positionMatch(position: string, positions: any) {
    const trimmedPosition = position.toLowerCase().trim();
    const exactMatch = positions.find((pos: any) => {pos.name.toLowerCase().trim() === trimmedPosition});
    if (exactMatch) {
        if (exactMatch.status === "open") {
            return exactMatch.name;
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
        return bestMatch.name;
    } else {
        return "General Application";
    }
}

function countryCodeMatch(countryCode: string) {
    if (!countryCode || countryCode.length !== 2 || !locationLookup.hasOwnProperty(countryCode)) {
        return "unknown";
    }
    return countryCode;
}

function mailDataToApplicant(processedMailData: any, parsedMailData: any, positions: any, date: Date) {
    if (!parsedMailData.hasOwnProperty("basicInfo")) {
        console.log('PIPELINE: OpenAI Parsing fields missing');
        return { applicant: null, fullResumeText: null, mapStatus: false };
    }
    let yoe;
    let position;
    let countryCode;
    let highestDegree;
    let degreeSubject;
    let graduationYear;
    let graduationMonth;
    if (parsedMailData.hasOwnProperty("manualFilters")) {
        yoe = parsedMailData.manualFilters.hasOwnProperty("yoe") ? parsedMailData.manualFilters.yoe : null;
        position = parsedMailData.manualFilters.hasOwnProperty("position") ? parsedMailData.manualFilters.position : null;
        countryCode = parsedMailData.manualFilters.hasOwnProperty("countryCode") ? parsedMailData.manualFilters.countryCode : null;
        highestDegree = parsedMailData.manualFilters.hasOwnProperty("highestDegree") ? parsedMailData.manualFilters.highestDegree : null;
        degreeSubject = parsedMailData.manualFilters.hasOwnProperty("degreeSubject") ? parsedMailData.manualFilters.degreeSubject : null;
        graduationYear = parsedMailData.manualFilters.hasOwnProperty("graduationYear") ? parsedMailData.manualFilters.graduationYear : null;
        graduationMonth = parsedMailData.manualFilters.hasOwnProperty("graduationMonth") ? parsedMailData.manualFilters.graduationMonth : null;
    } else {
        yoe = null;
        position = null;
        countryCode = null;
        highestDegree = null;
        degreeSubject = null;
        graduationYear = null;
        graduationMonth = null;
    }
    const fullName = parsedMailData.basicInfo.hasOwnProperty("fullName") ? parsedMailData.basicInfo.fullName : null;
    const age = parsedMailData.basicInfo.hasOwnProperty("age") ? parsedMailData.basicInfo.age : null;
    const university = parsedMailData.basicInfo.hasOwnProperty("university") ? parsedMailData.basicInfo.university : null;
    const email = parsedMailData.basicInfo.hasOwnProperty("email") ? parsedMailData.basicInfo.email : null;
    const phone = parsedMailData.basicInfo.hasOwnProperty("phone") ? parsedMailData.basicInfo.phone : null;
    const websiteUrl = parsedMailData.basicInfo.hasOwnProperty("websiteUrl") ? parsedMailData.basicInfo.websiteUrl : null;
    const linkedinUrl = parsedMailData.basicInfo.hasOwnProperty("linkedinUrl") ? parsedMailData.basicInfo.linkedinUrl : null;
    const githubUrl = parsedMailData.basicInfo.hasOwnProperty("githubUrl") ? parsedMailData.basicInfo.githubUrl : null;
    
    if (!fullName ) {
        console.log('PIPELINE: OpenAI Parsing fields missing');
        return { applicant: null, fullResumeText: null, mapStatus: false };
    }
    const applicant: Applicant = {
        "id": null,
        "applicantInfo": {
            "name": fullName,
            "age": age,
            "yoe": yoe,
            "contact": {
                "email": email,
                "phone": phone,
            },
            "countryCode": (countryCode && typeof countryCode === "string") ? countryCodeMatch(countryCode) : "unknown",
            "latestEducation": {
                "degree": (["Unknown", "No Degree", "Associate's", "Bachelor's", "Master's", "Doctoral"].includes(highestDegree)) ? highestDegree : "Unknown",
                "subject": degreeSubject,
                "university": university,
                "graduation": {
                    "month": graduationMonth,
                    "year": graduationYear
                }
            },
            "urls": {
                "website": websiteUrl,
                "linkedin": linkedinUrl,
                "github": githubUrl
            }
        },
        "recruitmentInfo": {
            "stars": null,
            "notes": null,
            "status": "newApply"
        },
        "applicationInfo": {
            "date": date,
            "method": "mail",
            "position": (position && typeof position === "string") ? positionMatch(position, positions) : "General Application",
            "mailInfo": {
                "date": date,
                "from": processedMailData.mailFrom,
                "subject": processedMailData.mailSubject,
                "body": processedMailData.mailBody
            }
        },
        "resumeInfo": {
            "uploadthing": {
                "url": processedMailData.resumeUrl,
                "key": processedMailData.resumeKey
            },
            "fullText": processedMailData.resumeText,
        }
    };
    return { applicant: applicant, fullResumeText: processedMailData.resumeText, mapStatus: true };
}

export async function POST(req: NextRequest) {
    const processedIndex = req.nextUrl.searchParams.get("index");

    if (!processedIndex) {
        console.log('Bad Request - No index provided');
        return Response.json({ status: 400, message: "Bad Request" });
    }

    const processedMailData = await redis.lindex("processed:mail:data:list", parseInt(processedIndex));

    const date = new Date();

    const positionsResponse = await redis.lrange("positions", 0, -1);
    const positions = (positionsResponse.length === 0) ? [{name: "General Application", status: "open"}] : positionsResponse;

    console.log('PIPELINE: Fetching OpenAI Parsing Response');
                                
    const prodUserMessage = `MAIL_SUBJECT\n${processedMailData.mailSubject}\n\nMAIL_FROM\n${processedMailData.mailFrom}\n\nMAIL_BODY\n${processedMailData.mailBody}\n\nRESUME_TEXT\n${processedMailData.resumeText}`;
    const testUserMessage = `MAIL_SUBJECT\n${processedMailData.mailSubject}\n\nRESUME_TEXT\n${processedMailData.resumeText}`;
    const test_mode = true;
    let systemMessage;
    let userMessage;
    if (test_mode) {
        systemMessage = TEST_MESSAGE;
        userMessage = testUserMessage;
        console.log('PIPELINE: Test Mode Active');
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
        console.log('PIPELINE: OpenAI Parsing Length Error');
        return;
    }
    if (!completion.choices[0].message.content) {
        console.log('PIPELINE: OpenAI Parsing No Content Error');
        return;
    }

    const parsedMailData = JSON.parse(completion.choices[0].message.content);
    
    const mapResult = mailDataToApplicant(processedMailData, parsedMailData, positions, date);
    const mapStatus = mapResult.mapStatus;
    if (!mapStatus) {
        console.log('PIPELINE: OpenAI Parsed Data Does Not Fit Applicant Schema');
        return;
    }
    const applicant = mapResult.applicant;
    if (!applicant) {
        console.log('PIPELINE: OpenAI Parsed Data Error');
        return;
    }
    const fullResumeText = mapResult.fullResumeText;
    if (!fullResumeText) {
        console.log('PIPELINE: OpenAI Parsed Data Error');
        return;
    }
    
    console.log('PIPELINE: Fetching OpenAI Embedding Response');
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

    await index.upsert({
        id: `${applicantID}_resume`,
        vector: resumeEmbedding,
        metadata: {
            position: applicant.applicationInfo.position,
            countryCode: applicant.applicantInfo.countryCode,
            status: applicant.recruitmentInfo.status,
            stars: applicant.recruitmentInfo.stars || 0,
            yoe: applicant.applicantInfo.yoe || -1,
            highestDegree: applicant.applicantInfo.latestEducation.degree,
            graduationYear: applicant.applicantInfo.latestEducation.graduation.year || -1,
            graduationMonth: applicant.applicantInfo.latestEducation.graduation.month || -1
        },
    });
    
    await redis.json.set(`applicant#${applicantID}`, "$", JSON.stringify(applicant));
    await redis.sadd("applicant:ids", applicantID);
    return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";