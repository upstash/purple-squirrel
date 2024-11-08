"use server";

import { Index } from "@upstash/vector";
import type { Applicant } from "@/types";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

export async function search(
  query: string = "",
): Promise<{ applicants: Applicant[]; duration: number }> {
  const startTime = performance.now();
  const response = await index.query({
    topK: 50,
    data: query,
    includeMetadata: true,
    includeVectors: false,
  });
  const endTime = performance.now();
  return {
    applicants: response.map((result) => result.metadata) as Applicant[],
    duration: endTime - startTime,
  };
}
