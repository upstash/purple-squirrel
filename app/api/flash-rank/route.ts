import OpenAI from "openai";
import { Index } from "@upstash/vector";
import type { NextRequest } from 'next/server';
import { sort } from 'fast-sort';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
})

async function gatherResults(vector: number[], inverse: number[], extendedTopK: number) {
    const results = await Promise.all([
        index.query({ topK: extendedTopK, vector: vector, includeMetadata: false, includeVectors: false, filter: "title = 'main'" }),
        index.query({ topK: extendedTopK, vector: vector, includeMetadata: false, includeVectors: false, filter: "title = 'education'" }),
        index.query({ topK: extendedTopK, vector: vector, includeMetadata: false, includeVectors: false, filter: "title = 'experience'" }),
        index.query({ topK: extendedTopK, vector: vector, includeMetadata: false, includeVectors: false, filter: "title = 'projects'" }),
        index.query({ topK: 1, vector: inverse, includeMetadata: false, includeVectors: false, filter: "title = 'main'" }),
        index.query({ topK: 1, vector: inverse, includeMetadata: false, includeVectors: false, filter: "title = 'education'" }),
        index.query({ topK: 1, vector: inverse, includeMetadata: false, includeVectors: false, filter: "title = 'experience'" }),
        index.query({ topK: 1, vector: inverse, includeMetadata: false, includeVectors: false, filter: "title = 'projects'" }),
    ]);
    return results;
}

export async function POST(req: NextRequest) {
    const data = await req.json();

    const queryText = data.queryText;
    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: queryText,
        encoding_format: "float",
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    const topK = data.searchSettings.topK;
    const multipliers = data.searchSettings.multipliers;
    const weights = data.searchSettings.weights;
    const previousApplicants = data.previousApplicants;
    if (!Array.isArray(previousApplicants)) {
        return Response.json({ status: 500, message: "Previous applicants is not an array" });
    }
    const fromScratch = (previousApplicants.length === 0);
    const extendedTopK = (fromScratch) ? topK * multipliers.firstTopKMultiplier : topK * multipliers.regularTopKMultiplier;

    const inverse = queryEmbedding.map(function(x) { return x * -1; });
    const results = await gatherResults(queryEmbedding, inverse, extendedTopK);
    const [mainResults, educationResults, experienceResults, projectsResults,
        inverseMainResults, inverseEducationResults, inverseExperienceResults, inverseProjectsResults] = results;

    const [mainMax, educationMax, experienceMax, projectsMax] = [mainResults, educationResults, experienceResults, projectsResults].map((x) => (x.length === 0) ? 0 : x[0].score);
    const [mainMin, educationMin, experienceMin, projectsMin] = [inverseMainResults, inverseEducationResults, inverseExperienceResults, inverseProjectsResults].map((x) => (x.length === 0) ? 0 : 1 - x[0].score);

    const mainResultSet = (fromScratch) ? null : mainResults.reduce((acc: Record<string, number>, val) => {
        acc[val.id] = val.score;
        return acc;
    }, {});
    const educationResultSet = educationResults.reduce((acc: Record<string, number>, val) => {
        acc[val.id] = val.score;
        return acc;
    }, {});
    const experienceResultSet = experienceResults.reduce((acc: Record<string, number>, val) => {
        acc[val.id] = val.score;
        return acc;
    }, {});
    const projectsResultSet = projectsResults.reduce((acc: Record<string, number>, val) => {
        acc[val.id] = val.score;
        return acc;
    }, {});
    const keyApplicants = (fromScratch) ? mainResults : previousApplicants;
    const applicantScores = await Promise.all(keyApplicants.map(async (pair) => {
        if (!pair || !pair.id || typeof pair.id !== "string" || !pair.score || typeof pair.score !== "number") {
            throw new TypeError("Error in flash-rank: Invalid element");
        }
        const id = (fromScratch) ? pair.id.split("_")[0] : pair.id;
        const mainID = `${id}_main`;
        const educationID = `${id}_education`;
        const experienceID = `${id}_experience`;
        const projectsID = `${id}_projects`;
        let mainScore;
        if (fromScratch) {
            mainScore = pair.score;
        } else {
            if (!mainResultSet) {
                throw new TypeError("Error in flash-rank: main set creation failed");
            }
            mainScore = mainResultSet[mainID] || mainMin;
        }
        const educationScore = educationResultSet[educationID] || educationMin;
        const experienceScore = experienceResultSet[experienceID] || experienceMin;
        const projectsScore = projectsResultSet[projectsID] || projectsMin;
        const normalMainScore = (mainMax === mainMin) ? 0.5 : (mainScore - mainMin) / (mainMax - mainMin);
        const normalEducationScore = (educationMax === educationMin) ? 0.5 : (educationScore - educationMin) / (educationMax - educationMin);
        const normalExperienceScore = (experienceMax === experienceMin) ? 0.5 : (experienceScore - experienceMin) / (experienceMax - experienceMin);
        const normalProjectsScore = (projectsMax === projectsMin) ? 0.5 : (projectsScore - projectsMin) / (projectsMax - projectsMin);
        const newScore = (weights.mainWeight * normalMainScore + weights.educationWeight * normalEducationScore + weights.experienceWeight * normalExperienceScore + weights.projectsWeight * normalProjectsScore) / (weights.mainWeight + weights.educationWeight + weights.experienceWeight + weights.projectsWeight);
        const score = (fromScratch) ? newScore : (weights.oldWeight * pair.score + weights.newWeight * newScore) / (weights.oldWeight + weights.newWeight);
        return { id, score };
    })).catch((error) => {
        return Response.json({ status: 500, message: "Error in flash-rank: " + error });
    });
    if (applicantScores instanceof Response) {
        return applicantScores;
    }
    const topApplicants = sort(applicantScores).desc(a => a.score).slice(0, topK);
    return Response.json({ status: 200, message: "Success", topApplicants: topApplicants });
}