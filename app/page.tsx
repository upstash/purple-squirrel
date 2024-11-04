"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

import QueryBar from "@/components/query-bar";
import ApplicantTable from "@/components/table";
import ExampleQueries from "@/components/example-queries";

import type { Applicant } from "@/types";
import { search } from "@/app/actions/search";
import { update } from "@/app/actions/update";

export default function Home() {
  const [applicants, setApplicants] = useState<Applicant[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  async function onSearch(query: string) {
    setLoading(true);
    const response = await search(query);
    setApplicants(response);
    setLoading(false);
  }

  async function onUpdate(applicant: Applicant) {
    setApplicants((applicants) =>
      applicants?.map((a) => (a.id === applicant.id ? applicant : a)),
    );
    await update(applicant);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-10">
      <main className="row-start-2 flex w-[860px] flex-col items-center gap-6 pt-16 sm:items-start">
        <div className="text-3xl font-bold text-violet-600">
          Purple Squirrel
        </div>
        <div className="flex w-full flex-col gap-3">
          <QueryBar query={query} setQuery={setQuery} onSearch={onSearch} />
          {loading ? (
            <Spinner className="text-violet-700" />
          ) : applicants ? (
            applicants.length > 0 ? (
              <ApplicantTable applicants={applicants} onUpdate={onUpdate} />
            ) : (
              <div className="text-center text-zinc-500">
                No applicants found.
              </div>
            )
          ) : (
            <ExampleQueries setQuery={setQuery} onSearch={onSearch} />
          )}
        </div>
      </main>
      <footer className="flex flex-wrap items-center justify-center gap-6">
        <a
          className="flex items-center gap-2 text-zinc-700 hover:underline hover:underline-offset-4"
          href="https://upstash.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created with Upstash →
        </a>
      </footer>
    </div>
  );
}
