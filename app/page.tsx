"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

import Search from "@/components/search";
import ApplicantTable from "@/components/table";

import type { Applicant } from "@/types";
import { search } from "@/app/actions/search";
import { update } from "@/app/actions/update";

export default function Home() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  async function onSearch(query?: string) {
    setLoading(true);
    const response = await search(query);
    setApplicants(response);
    console.log(response);
    setLoading(false);
  }

  async function onUpdate(applicant: Applicant) {
    setApplicants((applicants) =>
      applicants?.map((a) => (a.id === applicant.id ? applicant : a)),
    );
    await update(applicant);
  }

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <main>
      <header className="mx-auto max-w-screen-sm">
        <h1 className="text-center font-display text-xl font-bold text-primary">
          Purple Squirrel
        </h1>

        <Search
          className="mt-6"
          value={query}
          setQuery={setQuery}
          onSearch={onSearch}
        />
      </header>

      <div className="mx-auto mt-6 flex w-full max-w-screen-lg flex-col gap-3">
        {loading && <Spinner className="text-primary" />}

        {!loading && applicants.length > 0 ? (
          <ApplicantTable applicants={applicants} onUpdate={onUpdate} />
        ) : (
          <div className="text-center text-muted-foreground">
            No applicants found.
          </div>
        )}
      </div>
    </main>
  );
}
