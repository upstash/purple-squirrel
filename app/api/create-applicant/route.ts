import { Redis } from '@upstash/redis';
import { Index } from "@upstash/vector";
import type { NextRequest } from 'next/server';

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
    const applicant = data.applicant;
    const embeddings = data.embeddings;

    let applicantID = await redis.lpop("free:ids");
    if (!applicantID) {
        applicantID = await redis.incr("applicant:id:generator");
    }
    const existenceCheck = await redis.exists(`applicant#${applicantID}`); 
    if (existenceCheck === 1) {
        return Response.json({ status: 500, message: "Applicant ID Collusion" });
    }
    await index.upsert({
        id: `${applicantID}_main`,
        vector: embeddings.mainEmbedding,
        metadata: {
            title: "main",
        },
    });
    if (applicant.resumeInfo.partExists.education) {
        await index.upsert({
            id: `${applicantID}_education`,
            vector: embeddings.educationEmbedding,
            metadata: {
                title: "education",
            },
        });
    }
    if (applicant.resumeInfo.partExists.experience) {
        await index.upsert({
            id: `${applicantID}_experience`,
            vector: embeddings.experienceEmbedding,
            metadata: {
                title: "experience",
            },
        });
    }
    if (applicant.resumeInfo.partExists.projects) {
        await index.upsert({
            id: `${applicantID}_projects`,
            vector: embeddings.projectsEmbedding,
            metadata: {
                title: "projects",
            },
        });
    }
    
    await redis.json.set(`applicant#${applicantID}`, "$", JSON.stringify(applicant));
    await redis.sadd("applicant:ids", applicantID);
    return Response.json({ status: 200, message: "Success" });
}