import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Applicant, FilterTab } from "@/types";
import { Badge } from "@/components/ui/badge";

type Props = {
  tab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
  applicantsByGroup: Record<FilterTab, Applicant[]>;
};

export default function TableTabs({
  tab,
  onTabChange,
  applicantsByGroup,
}: Props) {
  return (
    <div className="flex justify-center">
      <Tabs
        value={tab}
        onValueChange={(value) => onTabChange(value as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="active" className="gap-2">
            Active
            <Badge variant="outline">{applicantsByGroup.active.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="favorites" className="gap-2">
            Favorites
            <Badge variant="outline">
              {applicantsByGroup.favorites.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="archived" className="gap-2">
            Archived
            <Badge variant="outline">{applicantsByGroup.archived.length}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
