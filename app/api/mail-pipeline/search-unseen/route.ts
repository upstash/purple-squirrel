var Imap = require('node-imap');

import { Redis } from '@upstash/redis';
import { Client, Receiver } from "@upstash/qstash";

import BASE_URL from '@/app/utils/baseURL';
import Connection from 'node-imap';

const receiver = new Receiver({
    currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY as string,
    nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY as string,
  });

const client = new Client({ token: process.env.QSTASH_TOKEN as string});

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: Request) {
    const signature = req.headers.get("Upstash-Signature");
    const body = await req.json();

    if (!signature) {
        return new Response('Unauthorized', {
            status: 401,
            });
    }
    const isValid = receiver.verify({
        body,
        signature,
        url: req.url,
      });

    if (!isValid) {
        return new Response('Unauthorized', {
            status: 401,
            });
    }
    const methodsValue = await redis.get("application:methods");
    if (!methodsValue || !Array.isArray(methodsValue) || !methodsValue.includes("mail")) {
        return Response.json({
            status: 500,
            message: "Mail method not enabled"
        });
    }

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
        attachmentOptions: { directory: process.cwd + "/tmp/" } // specify a download directory for attachments 
    });

    imap.once('ready', function() {
        console.log("Connection ready");
        console.log("Opening inbox");
        imap.openBox('INBOX', false, function (err: Error, box: Connection.Box) {
            imap.search([ 'UNSEEN' ], async function(err: Error, results: number[]) {
                if(!results || !results.length) {
                    console.log("No new emails")
                    imap.end();
                    return;
                }
                
                const msgs = results.map((result) => {
                    return {
                        queueName: "mail-fetch-queue",
                        url: `${BASE_URL}/api/mail-pipeline/fetch-unseen`,
                        body: {
                            mailID: result
                        },
                        retries: 0,
                    }
                });
                if (process.env.NODE_ENV === "production") {
                    const res = await client.batchJSON(msgs);
                    console.log("Batch response: ", res);
                } else {
                    for (const msg of msgs) {
                        await fetch(msg.url, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(msg.body)
                        });
                    }
                }
                
                imap.end();
            })
        });
      });
      
      imap.once('error', function(err: Error) {
          console.log("Error in connection to IMAP", err);
      });
      
      imap.once('close', function() {
          console.log('Connection ended');
      });
      
      imap.connect();
  
      return new Promise<Response>((resolve, reject) => {
          imap.once('close', async function () { //maybe, someone asking whether to use end or close and the author of the module says that close is always emitted so you should use that.
              resolve(new Response('OK', {
                    status: 200,
                }));
          });
      })
}

export const dynamic = "force-dynamic";