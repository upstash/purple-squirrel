import { Redis } from '@upstash/redis';
import BASE_URL from '@/app/utils/baseURL';
import { headers } from 'next/headers'

export const runtime = "edge";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST() {
    const authHeader = headers().get('authorization') || headers().get('Authorization');
    const processedMailDataNum = await redis.llen("processed:mail:data:list");
    const processedMailDataIndexList = Array.from(Array(processedMailDataNum).keys());
    if (processedMailDataNum > 0) {
        await Promise.all(processedMailDataIndexList.map(async (index) => {
            console.log('Starting /api/create-applicant');
            const processResponse = await fetch(`${BASE_URL}/api/create-applicant?index=${index}`, { method: "POST", headers: { "Authorization": authHeader } });
            const processResponseJson = await processResponse.json();
            if (processResponseJson.status !== 200) {
                console.log('PIPELINE: Error in /api/create-applicant');
                return;
            }
        })).then(async () => {
            console.log('Processed all processed mail data');
        }).catch((error) => {
            console.log('Error in create applicant orchestration:', error);
        });
    } else {
        console.log("No processed mail data");
    }
    return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";