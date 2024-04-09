import { Redis } from '@upstash/redis';
import OpenAI from "openai";
import type { NextRequest } from 'next/server';
import BASE_URL from '@/app/utils/baseURL';

const AUTH_USER = process.env.BASIC_AUTH_USER;
const AUTH_PASS = process.env.BASIC_AUTH_PASSWORD;

const SYSTEM_MESSAGE = `You are an applicant filterer.

You will be given data in the following format:
CURRENT_DATE
<current-date>

QUERY
<query>

RESUME_TEXT
<resume-text>

You will return nothing but a JSON like this:
{
    "filterPass": <filter-pass>,
}

<current-date> is the date when the query is made, this information may be useful in graduation information or other things.

<query> contains desired qualities about the applicant, if the applicant conforms to all of the qualities, "filterPass" should be true. If the applicant doesn't conform any of the qualities, "filterPass" should be false.

Important cases:
If there is no <query>, "filterPass" should be true.
If there is no <resume-text>, "filterPass" should be true.
If there is at least one quality the applicant doesn't conform, "filterPass" should be false.

"filterPass" must be boolean. It shouldn't be null, you shouldn't return a JSON without this key.
`;

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function flashRank(data: any) {
    const previousApplicants = await fetch(`${BASE_URL}/api/flash-rank`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Basic ' + Buffer.from(AUTH_USER + ":" + AUTH_PASS).toString('base64')
        },
        body: JSON.stringify(data),
    });
    return previousApplicants;
}


export async function POST(req: NextRequest) {
    const data = await req.json();

    const CURRENT_DATE = new Date().toDateString();

    let previousApplicants = data.previousApplicants;
    if (!Array.isArray(previousApplicants)) {
        return Response.json({ status: 500, message: "Previous applicants is not an array" });
    }
    const fromScratch = (previousApplicants.length === 0);

    if (fromScratch) {
        previousApplicants = await flashRank(data);
    }

    const queryText = data.queryText;

    const filterResults = await Promise.all(previousApplicants.map(async (pair: any) => {
        if (!pair || !pair.id || typeof pair.id !== "string" || !pair.score || typeof pair.score !== "number") {
            throw new TypeError("Error in hand-pick: Invalid element");
        }
        const fullResumeText = await redis.json.get(`applicant#${pair.id}`, "$.resumeInfo.fullText");
        if (!fullResumeText) {
            throw new Error("Error in hand-pick: No full resume text");
        }
        const userMessage = `CURRENT_DATE\n${CURRENT_DATE}\n\nQUERY\n${queryText}\n\nRESUME_TEXT\n${fullResumeText}`;
        let completion = await openai.chat.completions.create({
            messages: [
            {
                role: "system",
                content: SYSTEM_MESSAGE,
            },
            { role: "user", content: userMessage },
            ],
            model: "gpt-3.5-turbo-0125",
            response_format: { type: "json_object" },
        });
        if (completion.choices[0].finish_reason === "length") {
            throw new Error('hand-pick: OpenAI Filter Length Error');
        }
        if (!completion.choices[0].message.content) {
            throw new Error('hand-pick: OpenAI Filter No Content Error');
        }

        const filterJSON = JSON.parse(completion.choices[0].message.content);
        if (!filterJSON || !filterJSON.hasOwnProperty("filterPass") || typeof filterJSON.filterPass !== "boolean") {
            throw new Error('hand-pick: OpenAI Filter Error');
        }
        return filterJSON.filterPass;
        

    })).catch((error) => {
        return Response.json({ status: 500, message: "Error in flash-rank: " + error });
    });
    if (filterResults instanceof Response) {
        return filterResults;
    }
    const filteredApplicants = previousApplicants.filter((_: any, index: any) => filterResults[index]);
    return Response.json({ status: 200, message: "Success", filteredApplicants: filteredApplicants });
}