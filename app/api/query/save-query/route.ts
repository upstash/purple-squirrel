import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const data = await req.json();

  await redis.lpush(`saved:queries#${userId}`, data);
  await redis.ltrim(`saved:queries#${userId}`, 0, 49);

  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
