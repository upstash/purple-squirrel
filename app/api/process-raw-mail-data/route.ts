import { Blob } from "buffer";
import { utapi } from "@/app/utils/uploadthing/server/uploadthing";
import PDFParser from 'pdf2json';
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis';
import { FileEsque } from "uploadthing/types";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
    const index = req.nextUrl.searchParams.get("index");

    if (!index) {
        console.log('Bad Request - No index provided');
        return Response.json({ status: 400, message: "Bad Request" });
    }

    try {
        const rawMailData = await redis.lindex("raw:mail:data:list", parseInt(index));
    
        let resumeBuffer = Buffer.from(rawMailData.resumeBuffer.data);
    
        let fileBlob = new Blob([resumeBuffer]);
        let response = await utapi.uploadFiles(fileBlob as FileEsque);
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
                return Response.json({ status: 500, message: `Error in parsing PDf ${error}` });
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
            return Response.json({ status: 200, message: "Success", processedMailData: processedMailData });
        } else {
            console.log('Error in uploading file');
            return Response.json({ status: 500, message: "Error in uploading file" });
        }
    } catch (error) {
        console.log('API Error', error);
        return Response.json({ status: 500, message: `API Error ${error}` });
    }
}