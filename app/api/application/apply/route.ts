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

export async function POST(req: NextRequest) {
    const data = await req.json();
    const positionId = data.positionId;

    const { sessionClaims, userId } = auth()

    const authRole = sessionClaims?.metadata?.role;

    if (!authRole || (authRole !== "applicant")) {
        return Response.error();
    }

    const redisRes = await redis.json.get(`applicant#${userId}`, "$");
    if (!redisRes || !Array.isArray(redisRes)) {
        return Response.error();
    }
    const applicant = redisRes[0];

    const namespace = index.namespace(positionId)

    await namespace.upsert({
        id: `${userId}_resume`,
        data: applicant.resumeInfo.fullText,
        metadata: {
            countryCode: applicant.applicantInfo.countryCode,
            status: "newApply",
            stars: 0,
            notes: "",
            yoe: applicant.applicantInfo.yoe || -1,
            highestDegree: applicant.applicantInfo.latestEducation.degree,
            graduationYear: applicant.applicantInfo.latestEducation.graduation.year || -1,
            graduationMonth: applicant.applicantInfo.latestEducation.graduation.month || -1
        },
    });

    return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";