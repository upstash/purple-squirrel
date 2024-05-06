import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function GET() {
    const setupStatus = await redis.get("setup:status");
    if (typeof setupStatus === "boolean") {
        return Response.json(setupStatus);
    }
    return Response.json(false);
}

export const dynamic = "force-dynamic";