import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const id = data.id;
  const notes = data.notes;

  await redis.json.set(
    `applicant#${id}`,
    "$.applicantInfo.notes",
    `"${notes}"`
  );

  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
