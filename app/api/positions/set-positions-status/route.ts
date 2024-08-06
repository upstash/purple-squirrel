import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const positions = data.positions;
  const status = data.status;

  await Promise.all(
    positions.map(async (position: any) => {
      if (position.id === 1) {
        return;
      }
      const index = await redis.lpos("positions", position);
      await redis.lset("positions", index, { ...position, status: status });
    })
  );

  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
