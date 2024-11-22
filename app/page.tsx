"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import Search from "@/components/search";
import TableSkeleton from "@/components/table/skeleton";
import TableTabs from "@/components/table/tabs";
import TableCard from "@/components/table/card";

import type { Applicant, FilterTab } from "@/types";
import { search } from "@/app/actions/search";
import { update } from "@/app/actions/update";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") as FilterTab;

  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("");

  async function onSearch(query?: string) {
    setLoading(true);
      const response = await search(query);
      setDuration(response.duration);
      setApplicants(response.applicants);
      setLoading(false);
    }

  async function onUpdate(applicant: Applicant) {
    setApplicants((applicants) =>
      applicants?.map((a) => (a.id === applicant.id ? applicant : a)),
    );
    await update(applicant);
  }

  function onTabChange(tab: FilterTab) {
    router.push(`/?tab=${tab}`);
  }

  const applicantsByGroup = {
    active: applicants.filter((o) => !o.archived),
    favorites: applicants.filter((o) => o.favorite),
    archived: applicants.filter((o) => o.archived),
  };

  useEffect(() => {
    if (!tab) {
      router.push(`/?tab=active`);
    }
    onSearch(query);
  }, [tab, query, router]);

  return (
    <main>
      <header className="mx-auto max-w-screen-sm">
        <h1 className="text-center font-display text-xl font-bold text-primary">
          Purple Squirrel
        </h1>

        <div className="mt-4">
          <Search query={query} setQuery={setQuery} />
        </div>
      </header>

      <div className="mx-auto mt-6 flex w-full max-w-screen-lg flex-col gap-6">
        {loading ? (
          <TableSkeleton />
        ) : (
          <>
            <TableTabs
              tab={tab}
              onTabChange={onTabChange}
              applicantsByGroup={applicantsByGroup}
            />

            <TableCard
              applicants={applicantsByGroup[tab]}
              onUpdate={onUpdate}
            />
          </>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <div className="flex w-min flex-nowrap justify-center gap-1 text-nowrap rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-600">
          <span>{applicants.length} results</span>
          <span>·</span>
          <span>{duration.toFixed(2)}ms</span>
        </div>
      </div>
    </main>
  );
}
