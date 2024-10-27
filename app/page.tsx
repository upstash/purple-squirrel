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
      applicants?.map((a) => (a.id === applicant.id ? applicant : a))
    );
    await update(applicant);
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-10">
      <main className="flex flex-col gap-6 row-start-2 items-center sm:items-start w-[860px] pt-16">
        <div className="text-violet-600 font-bold text-3xl">
          Purple Squirrel
        </div>
        <div className="flex flex-col gap-3 w-full">
          <QueryBar query={query} setQuery={setQuery} onSearch={onSearch} />
          {loading ? (
            <Spinner className="text-violet-700" />
          ) : applicants ? (
            applicants.length > 0 ? (
              <ApplicantTable applicants={applicants} onUpdate={onUpdate} />
            ) : (
              <div className="text-zinc-500 text-center">
                No applicants found.
              </div>
            )
          ) : (
            <ExampleQueries setQuery={setQuery} onSearch={onSearch} />
          )}
        </div>
      </main>
      <footer className="flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-zinc-700"
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
