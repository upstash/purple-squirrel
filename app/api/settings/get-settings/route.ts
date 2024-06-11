import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function GET() {
    const setupStatus = await redis.get("setup:status");

    const value = await redis.json.get("mail:pipeline:settings", "$");
    let mailPipelineSettings;
    
    if (!value || !Array.isArray(value) || value.length !== 1) {
        mailPipelineSettings = {
            schedulingNum: 2,
            schedulingInterval: "hours",
        };
    } else {
        mailPipelineSettings = value[0];
    }
    const methodsValue = await redis.get("application:methods");
    let methods;
    if (!methodsValue || !Array.isArray(methodsValue) || methodsValue.length === 0) {
        methods = ["mail", "ps"]
    } else {
        methods = methodsValue;
    }

    return Response.json({
        status: 200,
        setupStatus: setupStatus,
        scheduling: mailPipelineSettings,
        methods: methods,
    });
}

export const dynamic = "force-dynamic";