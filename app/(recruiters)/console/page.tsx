'use client';

import { useUser } from "@clerk/clerk-react";
import {Tabs, Tab} from "@nextui-org/react";
import { ThemeSwitcher } from "@/app/components/theme/theme-switcher";
import {SquirrelIcon} from '@primer/octicons-react'
import {QueryTerminal, RecentQueries, SavedQueries} from "@/app/components/console";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import type { ConsoleTab, NextUIColor } from "@/types";
import { isConsoleTab } from "@/types/validations";

import { useConsole } from "@/app/managers";

function getTabColor(tab: ConsoleTab): NextUIColor {
  if (tab === "query-terminal") {
    return "secondary";
  } else if (tab === "recent-queries") {
    return "warning";
  } else {
    return "primary";
  }
}

export default function Page() {
    const { user, isLoaded } = useUser();
    const { activeTab, setActiveTab } = useConsole();

    if (!isLoaded || !user) {
      return null;
    }

    const authRole = user.publicMetadata?.role;
  
    return (
        <section className="flex flex-col box-border h-screen">
          <header className="flex-initial pt-unit-4 p-unit-4">
            <div className="flex items-center bg-default-50 py-unit-2 px-unit-1 rounded-medium">
              <div className="flex-1 flex items-center justify-start">
                <Link href="/" color="foreground">
                  <div className="text-secondary pl-unit-3 pr-unit-1">
                    <SquirrelIcon size={32} className="scale-x-[-1]" />
                  </div>
                  <h1 className="text-xl">Purple Squirrel</h1>
                </Link>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Tabs key={"primary"} color={getTabColor(activeTab)} aria-label="Tabs colors" selectedKey={activeTab} radius="full" onSelectionChange={(key) => {
                  if (typeof key === "string" && isConsoleTab(key)) {
                    setActiveTab(key);
                  }
                }}>
                  <Tab key="query-terminal" title="Query Terminal"/>
                  <Tab key="recent-queries" title="Recent Queries"/>
                  <Tab key="saved-queries" title="Saved Queries"/>
                </Tabs>
              </div>
              <div className="flex-1 flex items-center justify-end">
                <div className="flex gap-2">
                  {
                    authRole === "admin" && (
                      <Button isIconOnly color={getTabColor(activeTab)} variant="light" radius="full" size="sm" href="/dashboard" as={Link}>
                        <AdminPanelSettingsOutlinedIcon />
                      </Button>
                    )
                  }
                  <ThemeSwitcher color={getTabColor(activeTab)} />
                </div>
              </div>
            </div>
          </header>
          <div className="flex-auto px-unit-4 pb-unit-4 h-full">
            {(activeTab === "query-terminal") ? <QueryTerminal />
            : ((activeTab === "recent-queries") ? <RecentQueries />
            : <SavedQueries />)}
          </div>
        </section>
    )
  }