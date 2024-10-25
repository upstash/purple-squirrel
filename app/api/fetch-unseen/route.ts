import Imap from "node-imap";
import { ImapMessage } from "node-imap";
import { simpleParser, type Source } from "mailparser";
import { Client, Receiver } from "@upstash/qstash";

import QSTASH_TARGET_URL from "@/lib/qstash-target-url";

import { Blob } from "buffer";
import { utapi } from "@/lib/uploadthing/server/uploadthing";
// @ts-expect-error Error related to pdf-parse
import pdf from "pdf-parse/lib/pdf-parse";

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
    url: `${QSTASH_TARGET_URL}/api/fetch-unseen`,
  });

  if (!isValid) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const mailID = body.mailID;
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
    imap.openBox("INBOX", false, function () {
      const f = imap.fetch(mailID, {
        bodies: "",
        markSeen: true,
      });
      f.on("message", (msg: ImapMessage) => {
        msg.on("body", async (stream) => {
          console.log("Processing mail");
          // @ts-expect-error Error related to mailparser
          const parsed = await simpleParser(stream as Source);
          console.log("Mail parsed successfully");
          if (parsed.attachments.length == 1) {
            if (parsed.attachments[0].content.length < 1e6 - 5e4) {
              const fileBlob = new Blob([parsed.attachments[0].content]);
              const fileEsque = Object.assign(fileBlob, { name: "resume" });
              const response = await utapi.uploadFiles(fileEsque);

              if (response.data) {
                console.log("File uploaded successfully");

                try {
                  const parsedPDF = await pdf(parsed.attachments[0].content);
                  console.log("PDF parsed successfully");
                  const mailData = {
                    mailDate: parsed.date,
                    mailSubject: parsed.subject,
                    mailFrom: parsed.from?.html,
                    //"to": parsed.to,
                    mailBody: parsed.html,
                    resumeKey: response.data.key,
                    resumeUrl: response.data.url,
                    resumeText: parsedPDF.text,
                  };
                  await client.publishJSON({
                    url: `${QSTASH_TARGET_URL}/api/create-applicant`,
                    method: "POST",
                    body: {
                      mailData: mailData,
                    },
                    retries: 0,
                  });
                  console.log("processedMailData created");
                  imap.end();
                } catch (error) {
                  console.log("Error in parsing PDF", error);
                  imap.end();
                }
              } else {
                console.log("Error in uploading file");
              }
            } else {
              console.log("Attachment too big to handle. Ignoring.");
            }
          } else if (parsed.attachments.length > 1) {
            console.log("Too many attachments to handle. Ignoring.");
          } else {
            console.log("No attachments");
          }
          imap.end();
        });
      });
      f.once("error", (error: Error) => {
        if (error) {
          console.log("Error in fetching", error);
        }
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
      //maybe, someone asking whether to use end or close and the author of the module says that close is always emitted so you should use that.
      resolve(
        new Response("OK", {
          status: 200,
        })
      );
    });
  });
}

export const dynamic = "force-dynamic";
