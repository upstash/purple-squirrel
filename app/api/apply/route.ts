import type { NextRequest } from "next/server";
import type { ApplicantData, ApplicantMetadata } from "@/types";
import { Redis } from "@upstash/redis";
import { Index } from "@upstash/vector";
import OpenAI from "openai";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse";

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

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = body.data;
  const positionId = data.positionId;
  const pdfResponse = await fetch(data.resumeInfo.uploadthing.url);
  const parsedPDF = await pdf(await pdfResponse.arrayBuffer());
  const fullText = parsedPDF.text;

  const applicantData: ApplicantData = {
    applicantInfo: {
      ...data.applicantInfo,
      notes: "",
    },
    resumeInfo: {
      uploadthing: data.resumeInfo.uploadthing,
      fullText: fullText,
    },
    positionId: positionId,
  };
  const applicationMetadata: ApplicantMetadata = {
    countryCode: data.countryCode,
    status: "newApply",
    stars: 0,
    yoe: data.yoe || -1,
  };
  const resumeEmbeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: fullText,
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

  const namespace = index.namespace(`${positionId}`);

  await namespace.upsert({
    id: `${applicantID}_application`,
    vector: resumeEmbedding,
    metadata: applicationMetadata,
  });

  await redis.json.set(
    `applicant#${applicantID}`,
    "$",
    JSON.stringify(applicantData)
  );
  await redis.sadd("applicant:ids", applicantID);
  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
