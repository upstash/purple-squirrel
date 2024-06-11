import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
    const body = await req.json();
    const positionId = body.id;

    const setupStatus = await redis.get("setup:status");
    if (!setupStatus) {
        return Response.json({
            status: 400,
            message: "setup",
        });
    }
    
    const methodsValue = await redis.get("application:methods");
    if (!methodsValue || !Array.isArray(methodsValue) || methodsValue.length === 0 || !methodsValue.includes("ps")) {
        return Response.json({
            status: 400,
            message: "method",
        });
    }

    const positions = await redis.lrange("positions", 0, -1);
    if (positions.length === 0) {
        return Response.json({ status: 404, message: "not-found" });
    }
    const position = positions.find((p: any) => p.id === positionId);
    if (!position) {
        return Response.json({ status: 404, message: "not-found" });
    }
    const parsedPosition = JSON.parse(position);

    if (parsedPosition.status !== "open") {
        return Response.json({ status: 400, message: "closed" });
    }
    return Response.json(position);
}

export const dynamic = "force-dynamic";