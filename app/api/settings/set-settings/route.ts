import type { NextRequest } from "next/server";

import { Redis } from "@upstash/redis";
import { Client } from "@upstash/qstash";
import QSTASH_TARGET_URL from "@/app/utils/qstash-target-url";

const client = new Client({ token: process.env.QSTASH_TOKEN as string });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
  const data = await req.json();
  const scheduling = data.scheduling;
  const methods = data.methods;

  await redis.json.set("mail:pipeline:settings", "$", data.scheduling);
  await redis.set("application:methods", methods);
  await redis.set("setup:status", true);

  if (methods.includes("mail")) {
    const queue = client.queue({
      queueName: "mail-fetch-queue",
    });

    await queue.upsert({
      parallelism: 2,
    });
    console.log(`${QSTASH_TARGET_URL}/api/mail-pipeline/search-unseen`);

    await client.publishJSON({
      url: `${QSTASH_TARGET_URL}/api/mail-pipeline/search-unseen`,
      method: "POST",
      retries: 0,
      body: JSON.stringify({
        message: "Fetch unseen mails",
      }),
    });
    if (process.env.NODE_ENV === "production") {
      let cron;
      switch (scheduling.schedulingInterval) {
        case "minutes":
          cron = `*/${scheduling.schedulingNum} * * * *`;
          break;
        case "hours":
          cron = `0 */${scheduling.schedulingNum} * * *`;
          break;
      }
      if (!cron) {
        return Response.json({ status: 400, message: "Invalid cron" });
      }
      const schedules = client.schedules;
      const allSchedules = await schedules.list();
      for (let i = 0; i < allSchedules.length; i++) {
        if (
          allSchedules[i].destination ===
          `${QSTASH_TARGET_URL}/api/mail-pipeline/search-unseen`
        ) {
          await schedules.delete(allSchedules[i].scheduleId);
        }
      }

      await schedules.create({
        destination: `${QSTASH_TARGET_URL}/api/mail-pipeline/search-unseen`,
        cron: cron,
        retries: 0,
        body: JSON.stringify({
          message: "Fetch unseen mails",
        }),
      });
    }
  }
  if (process.env.NODE_ENV === "production" && !methods.includes("mail")) {
    const schedules = client.schedules;
    const allSchedules = await schedules.list();
    for (let i = 0; i < allSchedules.length; i++) {
      if (
        allSchedules[i].destination ===
        `${QSTASH_TARGET_URL}/api/mail-pipeline/search-unseen`
      ) {
        await schedules.delete(allSchedules[i].scheduleId);
      }
    }
  }

  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
