var Imap = require('node-imap'),
inspect = require('util').inspect;
var fs = require('fs');
const {simpleParser} = require('mailparser');
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers'

import { Client } from "@upstash/qstash";
import BASE_URL from '@/app/utils/baseURL';

const client = new Client({ token: process.env.QSTASH_TOKEN });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST() {
    const authHeader = headers().get('authorization') || headers().get('Authorization');
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
      fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`, 
      mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib. 
      attachments: true, // download attachments as they are encountered to the project directory 
      attachmentOptions: { directory: process.cwd + "/tmp/" } // specify a download directory for attachments 
    });

    let currentStatus = 200;
    let currentMessage = "Success";

    const scheduling = await redis.json.get("scheduling", "$");

    const currentTime = Date.now();
    await redis.set("last:inbox:check", currentTime);
    await redis.del("raw:mail:data:list");


    imap.once('ready', function() {
      console.log("Connection ready");
      console.log("Opening inbox");
      try{ 
        imap.openBox('INBOX', false, function (err, box) {
          imap.search([ 'UNSEEN' ], async function(err, results) {
            if(!results || !results.length){
              console.log("No new emails")
              if (process.env.NODE_ENV === "production") {
                const res = await client.publishJSON({
                  url: `${BASE_URL}/api/listen-inbox`,
                  headers: { "Authorization": authHeader},
                  delay: (scheduling.emptyDigestionInterval === "minutes" ? scheduling.emptyDigestionNum * 60 : scheduling.emptyDigestionNum * 3600),
                  retries: 0,
                });
              }
              imap.end();
              return;
            }    
            if (process.env.NODE_ENV === "production") {
              if (results.length > scheduling.applicantCount) {
                const res = await client.publishJSON({
                  url: `${BASE_URL}/api/listen-inbox`,
                  headers: { "Authorization": authHeader},
                  delay: (scheduling.emptyDigestionInterval === "minutes" ? scheduling.emptyDigestionNum * 60 : scheduling.emptyDigestionNum * 3600),
                  retries: 0,
                });
              } else {
                const res = await client.publishJSON({
                  url: `${BASE_URL}/api/listen-inbox`,
                  headers: { "Authorization": authHeader},
                  delay: (scheduling.emptyDigestionInterval === "minutes" ? scheduling.emptyDigestionNum * 60 : scheduling.emptyDigestionNum * 3600),
                  retries: 0,
                });
              }
            }
            Promise.all(results.slice(0, scheduling.applicantCount).map((result) => {
              return new Promise((resolve, reject) => {
                let f = imap.fetch(result, {
                  bodies: '',
                  markSeen: true
                });
                f.on('message', (msg, seqno) => {
                  let attrs;
                  msg.on('attributes', (a) => {
                    attrs = a;
                  });
                  msg.on('body', async (stream, info) => {
                    let parsed = await simpleParser(stream);
                    // console.log('mail', parsed, seqno, attrs);
                    // console.log('headers', parsed.headers, seqno, attrs);
                    // console.log('body', { html: parsed.html, text: parsed.text, textAsHtml: parsed.textAsHtml }, seqno, attrs);
                    if (parsed.attachments.length == 1) {
                      if (parsed.attachments[0].content.length < (1e6 - 5e4)) {
                        console.log('Pushing rawMailData to Redis');
                        let rawMailData = {
                          "mailDate": parsed.date,
                          "mailSubject": parsed.subject,
                          "mailFrom": parsed.from.html,
                          //"to": parsed.to,
                          "mailBody": parsed.html,
                          "resumeBuffer": parsed.attachments[0].content
                        }
                        await redis.lpush("raw:mail:data:list", JSON.stringify(rawMailData));
                        console.log('Pushed rawMailData to Redis');
                        resolve();
                      } else {
                        console.log('Attachment too big to handle. Ignoring.');
                        resolve();
                      }
                    } else if (parsed.attachments.length > 1) {
                      console.log('Too many attachments to handle. Ignoring.');
                      resolve();
                    } else {
                      console.log('No attachments');
                      resolve();
                    }
                  });
                });
                f.once('error', (error) => {
                  if (error) {
                    console.log('Error in fetching', error);
                    currentStatus = 500;
                    currentMessage = "Error in fetching" + error;
                  }
                });
              });
            })).then(() => {
              console.log('Processed all messages');
              imap.end();
            }).catch((error) => {
              console.log('Error processing messages:', error);
              currentStatus = 500;
              currentMessage = "Error processing messages" + error;
              imap.end();
            });
      })
        });}  catch (err){
          console.log("Error in opening inbox",err)
          currentStatus = 500;
          currentMessage = "Error in opening inbox" + err;
          }
    });
    
    imap.once('error', function(err) {
      console.log("Error in connection to IMAP", err);
      currentStatus = 500;
      currentMessage = "Error in connection to IMAP" + err;
    });
    
    imap.once('close', function() {
      console.log('Connection ended');
    });
    
    imap.connect();

    return new Promise((resolve, reject) => {
      imap.once('close', async function () { //maybe, someone asking whether to use end or close and the author of the module says that close is always emitted so you should use that.
        if (process.env.NODE_ENV === "production") {
          const res = await client.publishJSON({
            url: `${BASE_URL}/api/process-raw-mail-data-orchestrator`,
            method: "POST",
            headers: {
              Authorization: authHeader
            },
            retries: 0,
          });
          resolve(Response.json({ status: currentStatus, message: currentMessage }));
        } else {
          resolve(Response.json({ status: currentStatus, message: currentMessage }));
        }
      });
    })
  }

  export const dynamic = "force-dynamic";