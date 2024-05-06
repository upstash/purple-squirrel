import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function GET() {
    const value = await redis.json.get("scheduling", "$");
    
    if (!value || !Array.isArray(value) || value.length !== 1) {
        return Response.json({
            applicantCount: 50,
            fullDigestionNum: 6,
            fullDigestionInterval: "minutes",
            emptyDigestionNum: 30,
            emptyDigestionInterval: "minutes",
            routineDigestionNum: 4,
            routineDigestionInterval: "hours",
        });
    }

    return Response.json(value[0]);
}

export const dynamic = "force-dynamic";