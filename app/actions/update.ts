"use server";

import { Index } from "@upstash/vector";
import type { Applicant } from "@/types";

const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

export async function update(applicant: Applicant) {
  await index.update({
    id: applicant.id,
    metadata: applicant,
  });
}
