import { Redis } from '@upstash/redis';
import { auth } from "@clerk/nextjs/server"

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function GET() {
    const { userId } = auth()
    const queries = await redis.lrange(`recent:queries#${userId}`, 0, 29); 
    return Response.json(queries);
}

export const dynamic = "force-dynamic";