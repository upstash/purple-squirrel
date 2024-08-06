import { Redis } from "@upstash/redis";
import { auth } from "@clerk/nextjs/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function GET() {
  const { userId } = auth();

  const value = await redis.json.get(`search:settings#${userId}`, "$");

  if (!value || !Array.isArray(value) || value.length !== 1) {
    return Response.json({
      deepTopK: 10,
      flashTopK: 20,
      deepWeight: 0.5,
      flash: true,
    });
  }

  return Response.json(value[0]);
}

export const dynamic = "force-dynamic";
