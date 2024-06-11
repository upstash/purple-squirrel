import { Index } from '@upstash/vector';
import type { NextRequest } from 'next/server';
import type { Applicant, ApplicationMetadata } from '@/types/types';

const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
})

export async function POST(req: NextRequest) {
    const data = await req.json();
    const applicants = data.applicants;

    await Promise.all(applicants.map(async (applicant: any) => {
        const id: string = applicant.id;
        const positionId: number = applicant.positionId;
        const metadata: ApplicationMetadata = applicant.metadata;
        const namespace = index.namespace(`${positionId}`);
        await namespace.update({
            id: `${id}_application`,
            metadata: metadata
        });
    }));
    return Response.json({ status: 200, message: "Success" });
}

export const dynamic = "force-dynamic";