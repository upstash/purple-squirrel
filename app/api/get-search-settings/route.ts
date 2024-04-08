import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function GET() {
    const value = await redis.json.get("search:settings", "$");
    
    if (!value) {
        return Response.json({topK: 10, multipliers: {firstTopKMultiplier: 2, regularTopKMultiplier: 2}, weights: {mainWeight: 0.9, educationWeight: 0.4, experienceWeight: 0.7, projectsWeight: 0.1, oldWeight: 0.5, newWeight: 0.5}});
    }

    return Response.json(value);
}