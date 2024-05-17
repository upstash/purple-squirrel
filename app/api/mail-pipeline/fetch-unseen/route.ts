var Imap = require('node-imap');
const {simpleParser} = require('mailparser');

import { Client } from "@upstash/qstash";

import { headers } from 'next/headers'

import BASE_URL from '@/app/utils/baseURL';
import Connection, { ImapMessage } from 'node-imap';

import { Blob } from "buffer";
import { utapi } from "@/app/utils/uploadthing/server/uploadthing";
//import pdf from 'pdf-parse/lib/pdf-parse'
const pdf = require('pdf-parse');

import { FileEsque } from "uploadthing/types";
import PdfParse from "pdf-parse";

const client = new Client({ token: process.env.QSTASH_TOKEN as string});

export async function POST(req: Request) {
    const authHeader = headers().get('authorization') || headers().get('Authorization');
    if (!authHeader) {
        return new Response('Unauthorized', {
            status: 401,
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
        attachmentOptions: { directory: process.cwd + "/tmp/" } // specify a download directory for attachments 
    });

    imap.once('ready', function() {
        console.log("Connection ready");
        console.log("Opening inbox");
        imap.openBox('INBOX', false, function (err: Error, box: Connection.Box) {
            let f = imap.fetch(mailID, {
                bodies: '',
                markSeen: true
            });
            f.on('message', (msg: ImapMessage, seqno: number) => {
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
                            let fileBlob = new Blob([parsed.attachments[0].content]);
                            let response = await utapi.uploadFiles(fileBlob as FileEsque);
                            // console.log(response);
                            
                            if (response.data) {
                                console.log('File uploaded successfully');

                                try {
                                    const parsedPDF: PdfParse.Result = await pdf(parsed.attachments[0].content);
                                    console.log('PDF parsed successfully');
                                    let mailData = {
                                        "mailDate": parsed.date,
                                        "mailSubject": parsed.subject,
                                        "mailFrom": parsed.from.html,
                                        //"to": parsed.to,
                                        "mailBody": parsed.html,
                                        "resumeKey": response.data.key,
                                        "resumeUrl": response.data.url,
                                        "resumeText": parsedPDF.text
                                    }
                                    const res = await client.publishJSON({
                                        url: `${BASE_URL}/api/mail-pipeline/create-applicant`,
                                        method: "POST",
                                        body: {
                                            mailData: mailData
                                        },
                                        headers: {
                                          Authorization: authHeader
                                        },
                                        retries: 0,
                                      });
                                    console.log('processedMailData created');
                                } catch (error) {
                                    console.log('Error in parsing PDF', error);
                                }
                            } else {
                                console.log('Error in uploading file');
                            }
                        } else {
                            console.log('Attachment too big to handle. Ignoring.');
                        }
                    } else if (parsed.attachments.length > 1) {
                        console.log('Too many attachments to handle. Ignoring.');
                    } else {
                        console.log('No attachments');
                    }
                });
            });
            f.once('error', (error: Error) => {
                if (error) {
                    console.log('Error in fetching', error);
                }
            });
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