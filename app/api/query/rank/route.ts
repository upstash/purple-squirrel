import OpenAI from "openai";
import { Index } from "@upstash/vector";
import type { NextRequest } from "next/server";
import { sort } from "fast-sort";
import { Redis } from "@upstash/redis";
import type { ApplicantRow, ApplicantMetadata } from "@/types";

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

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

async function gatherResults(
  tagsEmbedding: number[],
  inverseEmbedding: number[],
  topK: number,
  filter: string,
  positionId: string
) {
  const namespace = index.namespace(positionId);
  let results;
  if (filter === "") {
    results = await Promise.all([
      namespace.query({
        topK: topK,
        vector: tagsEmbedding,
        includeMetadata: true,
        includeVectors: false,
      }),
      namespace.query({
        topK: 1,
        vector: inverseEmbedding,
        includeMetadata: false,
        includeVectors: false,
      }),
    ]);
  } else {
    results = await Promise.all([
      namespace.query({
        topK: topK,
        vector: tagsEmbedding,
        includeMetadata: true,
        includeVectors: false,
        filter: filter,
      }),
      namespace.query({
        topK: 1,
        vector: inverseEmbedding,
        includeMetadata: false,
        includeVectors: false,
      }),
    ]);
  }
  return results;
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const tags = data.tags;
  const positionId = data.positionId;
  const positionTitle = data.positionTitle;
  const filter = data.filter;
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: tags.join(", "),
    encoding_format: "float",
  });
  const tagsEmbedding = embeddingResponse.data[0].embedding;

  const topK =
    data.rankType === "flash"
      ? data.searchSettings.flashTopK
      : data.searchSettings.deepTopK;

  const inverseEmbedding = tagsEmbedding.map(function (x) {
    return x * -1;
  });
  const results = await gatherResults(
    tagsEmbedding,
    inverseEmbedding,
    topK,
    filter,
    positionId
  );

  const [directResults, inverseResults] = results;

  if (!Array.isArray(directResults) || !Array.isArray(inverseResults)) {
    return Response.json({
      status: 500,
      message: "Error in unified-rank: Invalid results",
    });
  }

  if (directResults.length === 0 || inverseResults.length === 0) {
    return Response.json({
      status: 200,
      message: "Success",
      flashRankedApplicants: [],
    });
  }

  const maxScore = directResults[0].score;
  const minScore = 1 - inverseResults[0].score;

  const flashScoredApplicants = await Promise.all(
    directResults.map(async (pair) => {
      if (
        !pair ||
        !pair.id ||
        typeof pair.id !== "string" ||
        !pair.hasOwnProperty("score") ||
        typeof pair.score !== "number"
      ) {
        throw new TypeError("Error in flash-rank: Invalid element");
      }
      const id = pair.id.split("_")[0];

      const score =
        maxScore === minScore
          ? 1
          : (pair.score - minScore) / (maxScore - minScore);

      const applicantData = await redis.json.get(`applicant#${id}`, "$");
      if (
        !applicantData ||
        !Array.isArray(applicantData) ||
        applicantData.length !== 1
      ) {
        throw new Error("Error in flash-rank: No applicant data");
      }
      const applicant: ApplicantRow = {
        id,
        ...applicantData[0],
        ...(pair.metadata as ApplicantMetadata),
        score,
      };
      return applicant;
    })
  ).catch((error) => {
    return Response.json({
      status: 500,
      message: "Error in unified-rank: " + error,
    });
  });
  if (flashScoredApplicants instanceof Response) {
    return flashScoredApplicants;
  }
  if (data.rankType === "flash") {
    const flashRankedApplicants = sort(flashScoredApplicants).desc(
        (a) => a.score
      );
    return Response.json({
      status: 200,
      message: "Success",
      rankedApplicants: flashRankedApplicants,
    });
  } else {
    const CURRENT_DATE = new Date().toDateString();

    const deepWeigth = data.searchSettings.deepWeight;

    const tags = data.tags;

    const deepScoredApplicants = await Promise.all(
      flashScoredApplicants.map(async (quartet: ApplicantRow) => {
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
        const fullResumeText = quartet.resumeInfo.fullText;
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
            (acc: number, val) =>
              acc + (typeof val === "boolean" && val ? 1 : 0),
            0
          ) /
            passes.length) *
            deepWeigth +
          quartet.score * (1 - deepWeigth);
        return {
          ...quartet,
          score: deepScore,
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
    const deepRankedApplicants = sort(deepScoredApplicants).desc(
      (a) => a.score
    );
    return Response.json({
      status: 200,
      message: "Success",
      rankedApplicants: deepRankedApplicants,
    });
  }
}

export const dynamic = "force-dynamic";
