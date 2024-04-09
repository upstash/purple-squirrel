import { Redis } from '@upstash/redis';
import type { NextRequest } from 'next/server';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL as string,
    token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

export async function POST(req: NextRequest) {
    const data = await req.json();
    const ids = data.ids;
    if (!Array.isArray(ids)) {
        return Response.json({ status: 500, message: "IDs is not an array" });
    }
    const tableInfoArray = await Promise.all(ids.map(async ({id, score}) => {
        const applicantData = await redis.json.get(`applicant#${id}`, "$"); 
        if (!applicantData || !Array.isArray(applicantData) || applicantData.length !== 1) {
            throw new Error("No applicant data");
        }
        const tableData = {
            name: applicantData[0].applicantInfo.name,
            role: applicantData[0].applicationInfo.role,
            team: applicantData[0].applicationInfo.team,
            status: applicantData[0].recruitmentInfo.status,
            age: applicantData[0].applicantInfo.age,
            location: applicantData[0].applicantInfo.location,
            stars: applicantData[0].recruitmentInfo.stars,
            resumeUrl: applicantData[0].resumeInfo.uploadthing.url,
            websiteUrl: applicantData[0].applicantInfo.urls.website,
            linkedinUrl: applicantData[0].applicantInfo.urls.linkedin,
            githubUrl: applicantData[0].applicantInfo.urls.github,
            notes: applicantData[0].recruitmentInfo.notes,
            email: applicantData[0].applicantInfo.email,
            phone: applicantData[0].applicantInfo.phone,
            yoe: applicantData[0].applicantInfo.yoe,
            degree: applicantData[0].applicantInfo.latestEducation.degree,
            subject: applicantData[0].applicantInfo.latestEducation.subject,
            university: applicantData[0].applicantInfo.latestEducation.university,
            notesSaved: true,
        };
        return {id, tableData};
    })).catch((error) => {
        return Response.json({ status: 500, message: "Error in get-applicants" + error.message });
    });
    if (tableInfoArray instanceof Response) {
        return Response.json({ status: 500, message: "Error in get-applicants" + tableInfoArray });;
    }
    const tableInfo = tableInfoArray.reduce((acc: Record<string, any>, val: any) => {
        acc[val.id] = val.tableData;
        return acc;
    }, {});
    return Response.json({ status: 200, message: "Success", tableInfo: tableInfo });
}

export const dynamic = "force-dynamic";