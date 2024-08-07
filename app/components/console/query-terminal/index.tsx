"use client";

import { useEffect } from "react";
import {
  ApplicantsTable,
  ApplicantCard,
  QueryBar,
  LatestApplicantsTable,
} from "./components";

import { useQueryTerminal } from "@/app/managers";

export function QueryTerminal() {
  const {
    setSearchSettings,
    setTableLoading,
    setQueryBarLoading,
    setPositions,
    applicantCard,
    firstQuery,
    setLatestApplicants,
  } = useQueryTerminal();

  useEffect(() => {
    fetch("/api/console/get-latest-applicants")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setLatestApplicants(data);
      });
  }, [setLatestApplicants]);

  useEffect(() => {
    fetch("/api/settings/get-search-settings")
      .then((res) => res.json())
      .then((data) => {
        setSearchSettings(data);
        setTableLoading({
          status: false,
          color: "default",
          text: "Loading Search Settings...",
        });
        setQueryBarLoading(false);
      });
  }, [setSearchSettings, setTableLoading, setQueryBarLoading]);

  useEffect(() => {
    fetch("/api/positions/get-positions")
      .then((res) => res.json())
      .then((data) => {
        setPositions(data);
      });
  }, [setPositions]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex-initial pb-unit-2">
        <QueryBar />
      </div>
      <div className="flex-auto flex h-full">
        <div className="flex-[72_1_0%] pt-unit-2 transition-all duration-300 ease-in-out">
          <div className="flex flex-col bg-default-50 rounded-medium h-full">
            {firstQuery ? <LatestApplicantsTable /> : <ApplicantsTable />}
          </div>
        </div>
        {applicantCard.display ? (
          <div className="flex-[28_1_0%] max-w-[400px] pl-unit-4 pt-unit-2 transition-all duration-300 ease-in-out">
            <div className="bg-default-50 rounded-medium w-full sticky pt-unit-1 pb-unit-2 px-unit-2 top-unit-4 z-50">
              <ApplicantCard />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
