import OpenAI from "openai";
import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import BASE_URL from "@/app/utils/baseURL";
import { sort } from "fast-sort";

const SYSTEM_MESSAGE = `You are an applicant examiner in an Applicant Tracking System.
You will be given an input like this:
CURRENT_DATE
<current-date>

QUALITY_ARRAY
[<quality-1>, <quality-2>, ...]

RESUME_TEXT
<resume-text>

You will return nothing but a JSON like this:
{
    <quality-1>: <pass-1>,
    <quality-2>: <pass-2>, 
    ...
}
Quality array is an array of strings.

Quality is a desired property about the applicant the user entered. It may be keyword or a complete sentence or anything in between. It may be related to skills, education, experience, projects, basic information such as location or any other information about the applicant.

Your job is to determine if the applicant possesses a desired quality. If the applicant possesses it, its corresponding pass should be true, otherwise it should be false. It should be boolean.

Information about the applicant can be found in the resume text part of the input, you can also use current date if needed. One example would be "Graduated" quality.

Do not be strict, if a quality can be inferred from the resume assume the applicant possesses it.
`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function flashRank(data: any, authHeader: any) {
  const flashRankResponse = await fetch(`${BASE_URL}/api/query/flash-rank`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(data),
  });
  const flashRankResponseData = await flashRankResponse.json();
  return flashRankResponseData.flashRankedApplicants;
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const authHeader =
    headers().get("authorization") || headers().get("Authorization");

  const CURRENT_DATE = new Date().toDateString();

  const deepWeigth = data.searchSettings.deepWeight;

  const flashRankedApplicants = await flashRank(data, authHeader);

  if (flashRankedApplicants instanceof Response) {
    return flashRankedApplicants;
  }
  if (!Array.isArray(flashRankedApplicants)) {
    return Response.json({
      status: 500,
      message: "Error in deep-rank: Flash Ranked applicants is not an array",
    });
  }

  const tags = data.tags;

  const deepScoredApplicants = await Promise.all(
    flashRankedApplicants.map(async (quartet: any) => {
      if (
        !quartet ||
        !quartet.id ||
        typeof quartet.id !== "string" ||
        !quartet.hasOwnProperty("score") ||
        typeof quartet.score !== "number"
      ) {
        console.log(quartet);
        throw new TypeError("Error in deep-rank: Invalid element");
      }
      const fullResumeText = quartet.fullResumeText;
      if (!fullResumeText) {
        throw new Error("Error in deep-rank: No full resume text");
      }
      const userMessage = `CURRENT_DATE\n${CURRENT_DATE}\n\nQUALITY_ARRAY\n['${tags.join(
        "', '"
      )}']\n\nRESUME_TEXT\n${fullResumeText}`;
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
        throw new Error("deep-rank: OpenAI Filter Length Error");
      }
      if (!completion.choices[0].message.content) {
        throw new Error("deep-rank: OpenAI Filter No Content Error");
      }

      const responseJSON = JSON.parse(completion.choices[0].message.content);
      const passes = Object.values(responseJSON);
      const deepScore =
        (passes.reduce(
          (acc: number, val) => acc + (typeof val === "boolean" && val ? 1 : 0),
          0
        ) /
          passes.length) *
          deepWeigth +
        quartet.score * (1 - deepWeigth);
      return {
        id: quartet.id,
        score: deepScore,
        applicantDoc: quartet.applicantDoc,
      };
    })
  ).catch((error) => {
    return Response.json({
      status: 500,
      message: "Error in deep-rank: " + error,
    });
  });
  if (deepScoredApplicants instanceof Response) {
    return deepScoredApplicants;
  }
  const deepRankedApplicants = sort(deepScoredApplicants).desc((a) => a.score);
  return Response.json({
    status: 200,
    message: "Success",
    deepRankedApplicants: deepRankedApplicants,
  });
}

export const dynamic = "force-dynamic";
