import { useState } from "react";

import type { Applicant, FilterTab } from "@/types";
import TableTabs from "./table-tabs";
import TableCard from "./table-card";
import TablePagination from "./table-pagination";

type Props = {
  applicants: Applicant[];
  onUpdate: (applicant: Applicant) => Promise<void>;
};

export default function ApplicantTable({ applicants, onUpdate }: Props) {
  const [tab, setTab] = useState<FilterTab>("active");
  const filteredApplicants = applicants?.filter((applicant) => {
    switch (tab) {
      case "active":
        return !applicant.archived;
      case "favorites":
        return applicant.favorite;
      case "archived":
        return applicant.archived;
    }
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = filteredApplicants
    ? Math.ceil(filteredApplicants.length / itemsPerPage)
    : 0;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayApplicants = filteredApplicants?.slice(startIndex, endIndex);

  function onTabChange(tab: FilterTab) {
    setTab(tab);
  }

  function onPageChange(page: number) {
    setCurrentPage(page);
  }

  return (
    <div className="flex flex-col gap-3">
      <TableTabs tab={tab} onTabChange={onTabChange} />
      <TableCard displayApplicants={displayApplicants} onUpdate={onUpdate} />
      <TablePagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}
