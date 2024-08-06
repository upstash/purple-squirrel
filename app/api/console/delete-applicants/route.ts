import { Redis } from "@upstash/redis";
import { Index } from "@upstash/vector";
import type { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const applicants = data.applicants;

  const ids = applicants.map((applicant: any) => applicant.id);

  await Promise.all([
    redis.del(...ids.map((id: string) => `applicant#${id}`)),
    redis.srem("applicant:ids", ...ids),
  ]);

  await Promise.all(
    applicants.map(async (applicant: any) => {
      const id: string = applicant.id;
      const positionId: number = applicant.positionId;
      const namespace = index.namespace(`${positionId}`);
      await namespace.delete([`${id}_application`]);
    })
  );

  await redis.rpush("free:ids", ...ids);

  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
