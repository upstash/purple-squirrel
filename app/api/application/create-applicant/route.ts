import type { NextRequest } from 'next/server';
import type { Applicant } from '@/types/types';
import { Redis } from '@upstash/redis';
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
// @ts-ignore
import pdf from 'pdf-parse/lib/pdf-parse'
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
    const { sessionClaims, userId } = auth()

    const authRole = sessionClaims?.metadata?.role;

    if (!userId || authRole !== "applicant") {
        return Response.error();
    }

    const profile = await req.json();
    const pdfResponse = await fetch(profile.resumeInfo.uploadthing.url);
    const parsedPDF = await pdf(await pdfResponse.arrayBuffer());
    const fullText = parsedPDF.text;
    
    const applicant: Applicant = {
        id: profile.id,
        applicantInfo: profile.applicantInfo,
        resumeInfo: {
            uploadthing: profile.resumeInfo.uploadthing,
            fullText: fullText
        }
    }
    await redis.json.set(`applicant#${profile.id}`, "$", JSON.stringify(applicant));
    await redis.sadd("applicant:ids", profile.id);

    try {
        const res = await clerkClient.users.updateUser(
          userId,
          {
            publicMetadata: {role: authRole, complete: true}
          }
        );
        return Response.json({ status: 200, message: res.publicMetadata });
      } catch (err) {
        return Response.error();
      }
}

export const dynamic = "force-dynamic";