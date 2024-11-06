"use server";

import { headers } from "next/headers";
import { Client } from "@upstash/qstash";
import QSTASH_TARGET_URL from "@/lib/qstash-target-url";

const client = new Client({ token: process.env.QSTASH_TOKEN as string });

export async function digest({
  folder,
  quantity,
  interval,
}: {
  folder: string;
  quantity: number;
  interval: "minutes" | "hours";
}) {
  const headersList = headers();
  const authHeader =
    headersList.get("authorization") ||
    headersList.get("Authorization") ||
    "mock-auth";
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
    headers: {
      Authorization: authHeader,
    },
    body: {
      folder,
    },
  });
  if (process.env.NODE_ENV === "production") {
    const cron =
      interval === "minutes"
        ? `*/${quantity} * * * *`
        : `0 */${quantity} * * *`;

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
      cron,
      retries: 0,
      headers: {
        Authorization: authHeader,
      },
      body: JSON.stringify({
        folder,
      }),
    });
  }
}
