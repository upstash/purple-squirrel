import OpenAI from "openai";
import { Index } from "@upstash/vector";
import type { NextRequest } from 'next/server';
import { sort } from 'fast-sort';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
})

async function gatherResults(tagsEmbedding: number[], inverseEmbedding: number[], topK: number, filter: string) {
    let results;
    if (filter === "") {
        results = await Promise.all([
            index.query({ topK: topK, vector: tagsEmbedding, includeMetadata: false, includeVectors: false }),
            index.query({ topK: 1, vector: inverseEmbedding, includeMetadata: false, includeVectors: false }),
        ]);
    } else {
        results = await Promise.all([
            index.query({ topK: topK, vector: tagsEmbedding, includeMetadata: false, includeVectors: false, filter: filter }),
            index.query({ topK: 1, vector: inverseEmbedding, includeMetadata: false, includeVectors: false }),
        ]);
    }
    return results;
}

export async function POST(req: NextRequest) {
    const data = await req.json();

    const tags = data.tags;
    const filter = data.filter;
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: tags.join(", "),
        encoding_format: "float",
    });
    const tagsEmbedding = embeddingResponse.data[0].embedding;

    const topK = (data.rankType === "flash") ? data.searchSettings.flashTopK : data.searchSettings.deepTopK;

    const inverseEmbedding = tagsEmbedding.map(function(x) { return x * -1; });
    const results = await gatherResults(tagsEmbedding, inverseEmbedding, topK, filter);

    const [directResults, inverseResults] = results;

    if (!Array.isArray(directResults) || !Array.isArray(inverseResults)) {
        return Response.json({ status: 500, message: "Error in unified-rank: Invalid results" });
    }

    if (directResults.length === 0 || inverseResults.length === 0) {
        return Response.json({ status: 200, message: "Success", flashRankedApplicants: [] });
    }

    const maxScore = directResults[0].score;
    const minScore = 1 - inverseResults[0].score;

    const flashScoredApplicants = await Promise.all(directResults.map(async (pair) => {
        if (!pair || !pair.id || typeof pair.id !== "string" || !pair.hasOwnProperty("score") || typeof pair.score !== "number") {
            throw new TypeError("Error in flash-rank: Invalid element");
        }
        const id = pair.id.split("_")[0];

        const score = (maxScore === minScore) ? 1 : (pair.score - minScore) / (maxScore - minScore);

        const applicantData = await redis.json.get(`applicant#${id}`, "$"); 
        if (!applicantData || !Array.isArray(applicantData) || applicantData.length !== 1) {
            throw new Error("Error in flash-rank: No applicant data");
        }
        const applicantDoc = {
            name: applicantData[0].applicantInfo.name,
            position: applicantData[0].applicationInfo.position,
            status: applicantData[0].recruitmentInfo.status,
            age: applicantData[0].applicantInfo.age,
            countryCode: applicantData[0].applicantInfo.countryCode,
            stars: applicantData[0].recruitmentInfo.stars,
            resumeUrl: applicantData[0].resumeInfo.uploadthing.url,
            websiteUrl: applicantData[0].applicantInfo.urls.website,
            linkedinUrl: applicantData[0].applicantInfo.urls.linkedin,
            githubUrl: applicantData[0].applicantInfo.urls.github,
            notes: applicantData[0].recruitmentInfo.notes,
            email: applicantData[0].applicantInfo.contact.email,
            phone: applicantData[0].applicantInfo.contact.phone,
            yoe: applicantData[0].applicantInfo.yoe,
            degree: applicantData[0].applicantInfo.latestEducation.degree,
            subject: applicantData[0].applicantInfo.latestEducation.subject,
            university: applicantData[0].applicantInfo.latestEducation.university,
            notesSaved: true,
        };
        if (data.rankType === "flash") {
            return {id, score, applicantDoc};
        } else {
            const fullResumeText = applicantData[0].resumeInfo.fullText;
            return {id, score, applicantDoc, fullResumeText};
        }
    })).catch((error) => {
        return Response.json({ status: 500, message: "Error in unified-rank: " + error });
    });
    if (flashScoredApplicants instanceof Response) {
        return flashScoredApplicants;
    }
    if (data.rankType === "flash") {
        const flashRankedApplicants = sort(flashScoredApplicants).desc(a => a.score);
        return Response.json({ status: 200, message: "Success", flashRankedApplicants: flashRankedApplicants });
    } else {
        return Response.json({ status: 200, message: "Success", flashRankedApplicants: flashScoredApplicants });
    }
}

export const dynamic = "force-dynamic";