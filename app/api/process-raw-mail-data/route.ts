import { Blob } from "buffer";
import { utapi } from "@/app/utils/uploadthing/server/uploadthing";
import PDFParser from 'pdf2json';
import { Kafka } from "@upstash/kafka";

export async function POST() {
    const kafka = new Kafka({
        url: process.env.UPSTASH_KAFKA_REST_URL!,
        username: process.env.UPSTASH_KAFKA_REST_USERNAME!,
        password: process.env.UPSTASH_KAFKA_REST_PASSWORD!
    });
    const c = kafka.consumer();
    const messages = await c.consume({
        consumerGroupId: "group_1",
        instanceId: "instance_1",
        topics: ["raw-mail-data"],
        autoOffsetReset: "earliest"
    });
    if (!messages) {
        return Response.json({ status: 500, message: "Kafka consume error" });
    }
    if (messages.length === 0) {
        return Response.json({ status: 200, message: "No new emails" });
    }
    let currentStatus = 200;
    let currentMessage = "Success";
    await Promise.all(messages.map((message) => {
        return new Promise<void>( async (resolve, reject) => {
            let rawMailData = JSON.parse(message.value).rawMailData;
            let resumeBuffer = Buffer.from(rawMailData.resumeBuffer.data);

            let fileBlob = new Blob([resumeBuffer]);
            let response = await utapi.uploadFiles(fileBlob);
            // console.log(response);
            
            if (response.data) {
                console.log('File uploaded successfully');

                let parsedTextPromise = new Promise((resolve, reject) => {
                    let pdfParser = new (PDFParser as any)(null, 1);
                    pdfParser.on('pdfParser_dataReady', () => {
                        // console.log(pdfParser.getRawTextContent());
                        let parsedTextInPromise = pdfParser.getRawTextContent();
                        resolve(parsedTextInPromise);
                    });
                
                    pdfParser.on('pdfParser_dataError', (errData: any) => {
                        reject(errData.parserError);
                    });
                    pdfParser.parseBuffer(resumeBuffer);
                }).catch((error) => {
                    console.log('Error in parsing PDF', error);
                    currentStatus = 500;
                    currentMessage = "Error in parsing PDF" + error;
                    resolve();
                });

                let parsedText = await parsedTextPromise;
                console.log('PDF parsed successfully');

                let processedMailData = {
                    "mailDate": rawMailData.mailDate,
                    "mailSubject": rawMailData.mailSubject,
                    "mailFrom": rawMailData.mailFrom,
                    //"to": parsed.to,
                    "mailBody": rawMailData.mailBody,
                    "resumeKey": response.data.key,
                    "resumeUrl": response.data.url,
                    "resumeText": parsedText
                }
                console.log('processedMailData created');
                console.log(processedMailData);
                
                let kafkaPromise = new Promise<void>(async (resolve, reject) => {
                    console.log('Sending processedMailData to Kafka');
                    let p = kafka.producer();
                    let message = { processedMailData: processedMailData };
                    const res = await p.produce("processed-mail-data", message);
                    console.log(res);
                    resolve();
                });
                await kafkaPromise;
                resolve();
            } else {
                console.log('Error in uploading file');
                currentStatus = 500;
                currentMessage = "Error in uploading file";
                resolve();
            }
        });
    }));
    return Response.json({ status: currentStatus, message: currentMessage });
}