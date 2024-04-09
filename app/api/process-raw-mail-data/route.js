import { Blob } from "buffer";
import { utapi } from "@/app/utils/uploadthing/server/uploadthing";
import pdf from 'pdf-parse/lib/pdf-parse'
import { Redis } from '@upstash/redis';
import { FileEsque } from "uploadthing/types";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
    const index = req.nextUrl.searchParams.get("index");

    if (!index) {
        console.log('Bad Request - No index provided');
        return Response.json({ status: 400, message: "Bad Request" });
    }

    try {
        const rawMailData = await redis.lindex("raw:mail:data:list", parseInt(index));
    
        let resumeBuffer = Buffer.from(rawMailData.resumeBuffer.data);
    
        let fileBlob = new Blob([resumeBuffer]);
        let response = await utapi.uploadFiles(fileBlob);
        // console.log(response);
        
        if (response.data) {
            console.log('File uploaded successfully');

            try {
                const parsedPDF = await pdf(resumeBuffer);
                console.log('PDF parsed successfully');
            } catch (error) {
                console.log('Error in parsing PDF', error);
                return Response.json({ status: 500, message: `Error in parsing PDF ${error}` });
            }
    
            console.log('PDF parsed successfully');
    
            let processedMailData = {
                "mailDate": rawMailData.mailDate,
                "mailSubject": rawMailData.mailSubject,
                "mailFrom": rawMailData.mailFrom,
                //"to": parsed.to,
                "mailBody": rawMailData.mailBody,
                "resumeKey": response.data.key,
                "resumeUrl": response.data.url,
                "resumeText": parsedPDF.text
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