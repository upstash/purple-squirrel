import type { NextRequest } from "next/server";

import { Client } from "@upstash/qstash";
import QSTASH_TARGET_URL from "@/lib/qstash-target-url";

const client = new Client({ token: process.env.QSTASH_TOKEN as string });

export async function POST(req: NextRequest) {
  const data = await req.json();
  const scheduling = data.scheduling;

  const queue = client.queue({
    queueName: "mail-fetch-queue",
  });

  await queue.upsert({
    parallelism: 2,
  });

  await client.publishJSON({
    url: `${QSTASH_TARGET_URL}/api/search-unseen`,
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
        allSchedules[i].destination === `${QSTASH_TARGET_URL}/api/search-unseen`
      ) {
        await schedules.delete(allSchedules[i].scheduleId);
      }
    }

    await schedules.create({
      destination: `${QSTASH_TARGET_URL}/api/search-unseen`,
      cron: cron,
      retries: 0,
      body: JSON.stringify({
        message: "Fetch unseen mails",
      }),
    });
  }

  return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";
