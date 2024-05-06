import { Redis } from '@upstash/redis';
import { headers } from 'next/headers'

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
    const data = await req.json();
    const authHeader = headers().get('authorization') || headers().get('Authorization');

    const currentTime = Date.now();

    const lastInboxCheck = await redis.get("last:inbox:check");

    const scheduling = await redis.json.get("scheduling", "$");

    if (lastInboxCheck && typeof lastInboxCheck === "number") {

        if (lastInboxCheck - currentTime > 1000 * 60 * scheduling.routineDigestionNum * (scheduling.routineDigestionInterval === "minutes" ? 1 : 60)) {
            await fetch("/api/listen-inbox", {
                method: "POST",
                headers: {
                    Authorization: authHeader,
                },
            })
        }
    }

    return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";