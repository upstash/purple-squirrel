var Imap = require("node-imap");
const { simpleParser } = require("mailparser");

import { Client, Receiver } from "@upstash/qstash";
import { Redis } from "@upstash/redis";

import QSTASH_TARGET_URL from "@/app/utils/qstash-target-url";
import Connection, { ImapMessage } from "node-imap";

import { Blob } from "buffer";
import { utapi } from "@/app/utils/uploadthing/server/uploadthing";
// @ts-ignore
import pdf from "pdf-parse/lib/pdf-parse";

import { FileEsque } from "uploadthing/types";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string,
});

const client = new Client({ token: process.env.QSTASH_TOKEN as string });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: Request) {
  const signature = req.headers.get("Upstash-Signature");
  const body = await req.json();

  if (!signature) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const isValid = receiver.verify({
    body,
    signature,
    url: req.url,
  });

  if (!isValid) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }
  const methodsValue = await redis.get("application:methods");
  if (
    !methodsValue ||
    !Array.isArray(methodsValue) ||
    !methodsValue.includes("mail")
  ) {
    return Response.json({
      status: 500,
      message: "Mail method not enabled",
    });
  }
  const data = await req.json();
  const mailID = data.mailID;
  var imap = new Imap({
    user: process.env.IMAP_USERNAME,
    password: process.env.IMAP_PASSWORD,
    host: process.env.IMAP_HOST,
    port: process.env.IMAP_PORT,
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
    debug: null, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: false, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: { directory: process.cwd + "/tmp/" }, // specify a download directory for attachments
  });

  imap.once("ready", function () {
    console.log("Connection ready");
    console.log("Opening inbox");
    imap.openBox("INBOX", false, function (err: Error, box: Connection.Box) {
      let f = imap.fetch(mailID, {
        bodies: "",
        markSeen: true,
      });
      f.on("message", (msg: ImapMessage, seqno: number) => {
        let attrs;
        msg.on("attributes", (a) => {
          attrs = a;
        });
        msg.on("body", async (stream, info) => {
          let parsed = await simpleParser(stream);
          // console.log('mail', parsed, seqno, attrs);
          // console.log('headers', parsed.headers, seqno, attrs);
          // console.log('body', { html: parsed.html, text: parsed.text, textAsHtml: parsed.textAsHtml }, seqno, attrs);
          if (parsed.attachments.length == 1) {
            if (parsed.attachments[0].content.length < 1e6 - 5e4) {
              let fileBlob = new Blob([parsed.attachments[0].content]);
              let response = await utapi.uploadFiles(fileBlob as FileEsque);
              // console.log(response);

              if (response.data) {
                console.log("File uploaded successfully");

                try {
                  const parsedPDF = await pdf(parsed.attachments[0].content);
                  console.log("PDF parsed successfully");
                  let mailData = {
                    mailDate: parsed.date,
                    mailSubject: parsed.subject,
                    mailFrom: parsed.from.html,
                    //"to": parsed.to,
                    mailBody: parsed.html,
                    resumeKey: response.data.key,
                    resumeUrl: response.data.url,
                    resumeText: parsedPDF.text,
                  };
                  const res = await client.publishJSON({
                    url: `${QSTASH_TARGET_URL}/api/mail-pipeline/create-applicant`,
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

  return new Promise<Response>((resolve, reject) => {
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
