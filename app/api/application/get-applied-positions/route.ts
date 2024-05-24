import type { NextRequest } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { Redis } from '@upstash/redis';
import { Index } from "@upstash/vector";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
})

export async function GET() {
    const { sessionClaims, userId } = auth()

    const authRole = sessionClaims?.metadata?.role;

    if (!authRole || (authRole !== "applicant")) {
        return Response.error();
    }

    const positionPairs = await redis.lrange(`applications#${userId}`, 0, -1);

    const appliedPositions = await Promise.all(positionPairs.map(async (pair) => {
        const hashIndex = pair.indexOf("#");
        const positionId = parseInt(pair.slice(0, hashIndex));
        const positionName = pair.slice(hashIndex + 1);
        const namespace = index.namespace(`${positionId}`);
        const fetchRes = await namespace.fetch([`${userId}_application`], { includeMetadata: true });
        const application = fetchRes[0];
        return {
            id: positionId,
            name: positionName,
            status: application?.metadata?.status
        }
    }));

    return Response.json({ status: 200, message: "Success", appliedPositions: appliedPositions });
}

export const dynamic = "force-dynamic";