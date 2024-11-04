import { useState } from "react";

import type { Applicant, FilterTab } from "@/types";
import TableTabs from "./table-tabs";
import TableCard from "./table-card";

type Props = {
  applicants: Applicant[];
  onUpdate: (applicant: Applicant) => Promise<void>;
};

export default function ApplicantTable({ applicants, onUpdate }: Props) {
  const [tab, setTab] = useState<FilterTab>("active");

  const applicantsByGroup = {
    active: applicants.filter((o) => !o.archived),
    favorites: applicants.filter((o) => o.favorite),
    archived: applicants.filter((o) => o.archived),
  };

  function onTabChange(tab: FilterTab) {
    setTab(tab);
  }

  return (
    <div className="space-y-6">
      <TableTabs
        tab={tab}
        onTabChange={onTabChange}
        applicantsByGroup={applicantsByGroup}
      />
      <TableCard applicants={applicantsByGroup[tab]} onUpdate={onUpdate} />
    </div>
  );
}
