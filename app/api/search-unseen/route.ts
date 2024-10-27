import Imap from "node-imap";
import { Client, Receiver } from "@upstash/qstash";

import QSTASH_TARGET_URL from "@/lib/qstash-target-url";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string,
});

const client = new Client({ token: process.env.QSTASH_TOKEN as string });

export async function POST(req: Request) {
  const signature = req.headers.get("Upstash-Signature");
  const body = await req.json();

  if (!signature) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const isValid = await receiver.verify({
    body: JSON.stringify(body),
    signature,
    url: `${QSTASH_TARGET_URL}/api/search-unseen`,
  });

  if (!isValid) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const folder = JSON.parse(body).folder

  const imap = new Imap({
    user: process.env.IMAP_USERNAME!,
    password: process.env.IMAP_PASSWORD!,
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT!),
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    tlsOptions: { rejectUnauthorized: false },
  });

  imap.once("ready", function () {
    console.log("Connection ready");
    console.log("Opening inbox");
    imap.openBox(folder, false, function () {
      imap.search(["UNSEEN"], async function (err: Error, results: number[]) {
        if (!results || !results.length) {
          console.log("No new emails");
          imap.end();
          return;
        }

        const msgs = results.map((result) => {
          return {
            queueName: "mail-fetch-queue",
            url: `${QSTASH_TARGET_URL}/api/fetch-unseen`,
            body: {
              mailID: result,
              folder,
            },
            retries: 0,
          };
        });
        const res = await client.batchJSON(msgs);
        console.log("Batch response: ", res);

        imap.end();
      });
    });
  });

  imap.once("error", function (err: Error) {
    console.log("Error in connection to IMAP", err);
  });

  imap.once("close", function () {
    console.log("Connection ended");
  });

  imap.connect();

  return new Promise<Response>((resolve) => {
    imap.once("close", async function () {
      resolve(
        new Response("OK", {
          status: 200,
        })
      );
    });
  });
}

export const dynamic = "force-dynamic";
