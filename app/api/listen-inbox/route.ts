var Imap = require('node-imap'),
inspect = require('util').inspect;
var fs = require('fs');
const {simpleParser} = require('mailparser');
var async = require('async');
import { Kafka } from "@upstash/kafka";

export async function POST() {
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

    const kafka = new Kafka({
      url: process.env.UPSTASH_KAFKA_REST_URL!,
      username: process.env.UPSTASH_KAFKA_REST_USERNAME!,
      password: process.env.UPSTASH_KAFKA_REST_PASSWORD!
    });

    let currentStatus = 200;
    let currentMessage = "Success";


    imap.once('ready', function() {
      console.log("Connection ready");
      console.log("Opening inbox");
      try{ 
        imap.openBox('INBOX', false, function (err: any, box: any) {
          imap.search([ 'UNSEEN' ], function(err: any, results: any) {
            if(!results || !results.length){
              console.log("No new emails")
              imap.end();
              return;
            }    

            Promise.all(results.map((result: any) => {
              return new Promise<void>((resolve, reject) => {
                let f = imap.fetch(result, {
                  bodies: '',
                  markSeen: true
                });
                f.on('message', (msg: any, seqno: any) => {
                  let attrs;
                  msg.on('attributes', (a: any) => {
                    attrs = a;
                  });
                  msg.on('body', async (stream: any, info: any) => {
                    let parsed = await simpleParser(stream);
                    // console.log('mail', parsed, seqno, attrs);
                    // console.log('headers', parsed.headers, seqno, attrs);
                    // console.log('body', { html: parsed.html, text: parsed.text, textAsHtml: parsed.textAsHtml }, seqno, attrs);
                    if (parsed.attachments.length == 1) {
                      if (parsed.attachments[0].content.length < 1e6) {
                        console.log('Sending rawMailData to Kafka');
                        let p = kafka.producer();
                        let rawMailData = {
                          "mailDate": parsed.date,
                          "mailSubject": parsed.subject,
                          "mailFrom": parsed.from.html,
                          //"to": parsed.to,
                          "mailBody": parsed.html,
                          "resumeBuffer": parsed.attachments[0].content
                        }
                        let message = { rawMailData: rawMailData };
                        const res = await p.produce("raw-mail-data", message);
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
                f.once('error', (error: any) => {
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
    
    imap.once('error', function(err: any) {
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
        resolve(Response.json({ status: currentStatus, message: currentMessage }));
      });
    })
  }
