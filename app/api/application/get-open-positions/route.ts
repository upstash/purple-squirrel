import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function GET() {
    const positions = await redis.lrange("positions", 0, -1);
    if (positions.length === 0) {
        await redis.lpush("positions", {id: 0, name: "General Application", status: "open"}); 
        return Response.json([{id: 0, name: "General Application", status: "open"}]);
    }
    const openPositions = positions.filter((position: any) => position.status === "open");

    return Response.json(openPositions);
}

export const dynamic = "force-dynamic";