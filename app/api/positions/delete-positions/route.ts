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
  const positions = data.positions;

  await Promise.all(
    positions.map(async (position: any) => {
      if (position.id === 1) {
        return;
      }
      await redis.lrem("positions", 1, position);
      const ids = await redis.smembers(`position#${position.id}:ids`);
      redis.del(...ids.map((id: string) => `applicant#${id}`)),

      await Promise.all(
        ids.map(async (id: string) => {
          const positionId: number = position.id;
          const namespace = index.namespace(`${positionId}`);
          await namespace.delete([`${id}_application`]);
          await redis.lrem(`latest:applicants`, 1, { id: id, positionId: positionId });
        })
      );

      await redis.rpush("free:ids", ...ids);
      await redis.del(`position#${position.id}:ids`);
      
      try {
        await index.deleteNamespace(position.id);
      } catch (error) {
        console.log(error);
      }
    })
  );
  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
