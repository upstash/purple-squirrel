import { Client } from "@upstash/qstash";
import { Redis } from '@upstash/redis';
import BASE_URL from '@/app/utils/baseURL';
import { headers } from 'next/headers'

export const runtime = "edge";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const client = new Client({ token: process.env.QSTASH_TOKEN });

export async function POST() {
    const authHeader = headers().get('authorization') || headers().get('Authorization');
    await redis.del("processed:mail:data:list");
    const rawMailDataNum = await redis.llen("raw:mail:data:list");
    const rawMailDataIndexList = Array.from(Array(rawMailDataNum).keys());
    if (rawMailDataNum > 0) {
        await Promise.all(rawMailDataIndexList.map(async (index) => {
            console.log('Starting /api/process-raw-mail-data');
            const processResponse = await fetch(`${BASE_URL}/api/process-raw-mail-data?index=${index}`, { method: "POST", headers: { "Authorization": authHeader } });
            const processResponseJson = await processResponse.json();
            if (processResponseJson.status !== 200) {
                console.log('PIPELINE: Error in /api/process-raw-mail-data');
                return;
            }
            const processedMailData = processResponseJson.processedMailData;
            await redis.lpush("processed:mail:data:list", JSON.stringify(processedMailData));
            console.log('Pushed processedMailData to Redis');
        })).then(async () => {
            console.log('Processed all raw mail data');
            const res = await client.publishJSON({
                url: `${BASE_URL}/api/create-applicant-orchestrator`,
                method: "POST",
                headers: {
                  Authorization: authHeader
                },
                retries: 0,
              });
        }).catch((error) => {
            console.log('Error in raw mail data orchestration:', error);
        });
    } else {
        console.log("No raw mail data to process");
    }
}

export const dynamic = "force-dynamic";