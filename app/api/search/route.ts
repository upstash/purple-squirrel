import OpenAI from "openai";
import type { NextRequest } from 'next/server';
import { headers } from 'next/headers'
import BASE_URL from "@/app/utils/baseURL";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


const SYSTEM_MESSAGE = `You are a query interpreter in an applicant tracking system.

You will return nothing but a JSON like this:
{
    "filter": <filtering-part>,
    "rank": <ranking-part>
}
Values of filter and rank are strings. If not applicable, put null, do not return without the complete set of keys.

"filter" only contains qualities that are not only desirable, but absolutely mandatory. It should be a paragraph of yes/no questions directed to a filter bot about the candidate. You can partition and rephrase the query in a series of questions.

"rank" contains all the qualities in the query. It should be a paragraph of resume bullet point like statements. You can partition and rephrase the query in a series of bullet points.

During the partition and rephrasing try not to add commentary.
`;

async function flashRank(data: any, authHeader: any) {
    const flashRankResponse = await fetch(`${BASE_URL}/api/flash-rank`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
        },
        body: JSON.stringify(data),
    });
    const flashRankData = await flashRankResponse.json();
    return flashRankData.topApplicants;
}

async function handPick(data: any, authHeader: any) {
    const handPickResponse = await fetch(`${BASE_URL}/api/hand-pick`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": authHeader
        },
        body: JSON.stringify(data),
    });
    const handPickData = await handPickResponse.json();
    return handPickData.filteredApplicants;
}

export async function POST(req: NextRequest) {
    const data = await req.json();
    const authHeader = headers().get('authorization') || headers().get('Authorization');

    const previousApplicants = data.previousApplicants;
    if (!Array.isArray(previousApplicants)) {
        return Response.json({ status: 500, message: "Previous applicants is not an array" });
    }
    const fromScratch = (previousApplicants.length === 0);

    const queryText = data.queryText;

    const userMessage = queryText;
    const completion = await openai.chat.completions.create({
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
        return Response.json({ status: 500, message: "Query Interpreter: OpenAI Incomplete JSON Error" });
    }
    if (!completion.choices[0].message.content) {
        return Response.json({ status: 500, message: "Query Interpreter: OpenAI No Content Error" });
    }

    const interpretation = JSON.parse(completion.choices[0].message.content);
    if (!interpretation) {
        return Response.json({ status: 500, message: "Query Interpreter: OpenAI null JSON" });
    }

    let filteredTopApplicants;

    if (interpretation.filter && typeof interpretation.filter === "string") {
        if (interpretation.rank && typeof interpretation.rank === "string") {
            if (fromScratch) {
                data.queryText = interpretation.rank;
                const topApplicants = await flashRank(data, authHeader);
                data.queryText = interpretation.filter;
                data.previousApplicants = topApplicants;
                filteredTopApplicants = await handPick(data, authHeader);
            } else {
                const rankData = structuredClone(data);
                const filterData = structuredClone(data);
                rankData.queryText = interpretation.rank;
                filterData.queryText = interpretation.filter;
                const [topApplicants, filteredApplicants] = await Promise.all([flashRank(rankData, authHeader), handPick(filterData, authHeader)]);
                if (!Array.isArray(topApplicants) || !Array.isArray(filteredApplicants)) {
                    return Response.json({ status: 500, message: "Error" });
                }
                const filteredIDs = filteredApplicants.map((x) => x.id);
                filteredTopApplicants = topApplicants.filter((currentValue) => filteredIDs.includes(currentValue.id));
            }
        } else {
            data.queryText = interpretation.filter;
            filteredTopApplicants = await handPick(data, authHeader);
        }
    } else {
        if (interpretation.rank && typeof interpretation.rank === "string") {
            data.queryText = interpretation.rank;
            filteredTopApplicants = await flashRank(data, authHeader);
        } else {
            return Response.json({ status: 500, message: "No filtering or ranking performed", data: null });
        }
    }
    return Response.json({ status: 200, message: "Success", filteredTopApplicants: filteredTopApplicants });
}