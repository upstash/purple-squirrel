import { Redis } from "@upstash/redis";
import { Index } from "@upstash/vector";
import type { Applicant, ApplicantData, ApplicantMetadata } from "@/types";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

export async function GET() {
  const latestApplicants = (await redis.lrange(
    "latest:applicants",
    0,
    9
  )) as unknown as { id: number; positionId: number }[];
  const applicants = await Promise.all(
    latestApplicants.map(async (latestApplicant) => {
      const applicantData = ((await redis.json.get(
        `applicant#${latestApplicant.id}`,
        "$"
      )) as unknown as ApplicantData[])?.[0];
      const namespace = index.namespace(`${latestApplicant.positionId}`);
      const applicantMetadata = (await namespace.fetch(
        [`${latestApplicant.id}_application`],
        { includeMetadata: true }
      ))[0]?.metadata as ApplicantMetadata;
      const applicant: Applicant = {
        id: latestApplicant.id,
        ...applicantData,
        ...applicantMetadata,
      };
      return applicant;
    })
  );
  return Response.json(applicants);
}

export const dynamic = "force-dynamic";
