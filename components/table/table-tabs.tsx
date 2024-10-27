import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { FilterTab } from "@/types";

type Props = {
  tab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
};

export default function TableTabs({ tab, onTabChange }: Props) {
  return (
    <div className="flex flex-row w-full justify-center">
      <Tabs
        value={tab}
        onValueChange={(value) => onTabChange(value as FilterTab)}
      >
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
