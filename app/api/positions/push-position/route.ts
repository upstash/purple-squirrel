import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const name = data.name;

  const positionId = await redis.incr("position:id:generator");

  await redis.lpush("positions", {
    id: positionId,
    name: name,
    status: "open",
  });

  return Response.json({ status: 200, message: "Success", id: positionId });
}

export const dynamic = "force-dynamic";
