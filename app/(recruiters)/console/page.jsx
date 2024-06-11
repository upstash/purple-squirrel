'use client';

import { useUser } from "@clerk/clerk-react";
import React, { useState, useEffect } from 'react';
import {Tabs, Tab} from "@nextui-org/react";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import {SquirrelIcon} from '@primer/octicons-react'
import QueryTerminal from "./query-terminal/QueryTerminal";
import RecentQueries from "./recent-queries/RecentQueries";
import SavedQueries from "./saved-queries/SavedQueries";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";

function getTabColor(tab) {
  if (tab === "query-terminal") {
    return "secondary";
  } else if (tab === "recent-queries") {
    return "warning";
  } else {
    return "primary";
  }
}

export default function Page() {
    const { isSignedIn, user, isLoaded } = useUser();

    const [activeTab, setActiveTab] = useState("query-terminal");

    const [applicants, setApplicants] = useState([]);

    const [tableLoading, setTableLoading] = useState({status: true, color: "default", text: "Loading Search Settings..."});
    const [queryBarLoading, setQueryBarLoading] = useState(true);

    const [filter, setFilter] = useState({
      positionFilter: null,
      countryCodeFilter: [],
      statusFilter: [],
      starsFilter: -1,
      yoeFilter: {
        min: -1,
        max: -1,
      },
    });
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    const [searchSettings, setSearchSettings] = useState({deepTopK: 10, flashTopK: 20, deepWeight: 0.5, flash: false});

    const [tags, setTags] = useState([]);
    const [tagText, setTagText] = useState("");

    const [cardState, setCardState] = useState({display: false, id: null, score: null, doc: null});

    const [recentQueriesState, setRecentQueriesState] = useState({recentQueries: [], loading: true});
    const [savedQueriesState, setSavedQueriesState] = useState({savedQueries: [], loading: true});

    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    const INITIAL_VISIBLE_COLUMNS = ["score", "name", "position", "location", "stars", "status", "actions"];

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortDescriptor, setSortDescriptor] = React.useState({
      column: "score",
      direction: "descending",
    });
    const [tablePage, setTablePage] = React.useState(1);

    const [positions, setPositions] = useState([{id: 1, name: "General Application", status: "open"}]);
    const [positionSearchText, setPositionSearchText] = React.useState("");

    const [locationSearchText, setLocationSearchText] = React.useState("");

    const [settingsTab, setSettingsTab] = React.useState("filters");

    useEffect(() => {
      fetch('/api/settings/get-search-settings')
        .then((res) => res.json())
        .then((data) => {
          setSearchSettings(data);
          setTableLoading({status: false, color: "default", text: "Loading Search Settings..."});
          setQueryBarLoading(false);
        })
    }, [setSearchSettings, setTableLoading, setQueryBarLoading]);

  useEffect(() => {
      fetch('/api/query/get-recent-queries')
        .then((res) => res.json())
        .then((data) => {
          setRecentQueriesState({recentQueries: data, loading: false});
        })
    }, [setRecentQueriesState]);
  
  useEffect(() => {
      fetch('/api/query/get-saved-queries')
        .then((res) => res.json())
        .then((data) => {
          setSavedQueriesState({savedQueries: data, loading: false});
        })
    }, [setSavedQueriesState]);

  useEffect(() => {
      fetch('/api/positions/get-positions')
        .then((res) => res.json())
        .then((data) => {
          setPositions(data);
        })
    }, [setPositions]);

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
                    setActiveTab(key);
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
            {(activeTab === "query-terminal") ? <QueryTerminal 
                                                  applicants={applicants}
                                                  setApplicants={setApplicants}
                                                  tableLoading={tableLoading}
                                                  setTableLoading={setTableLoading}
                                                  queryBarLoading={queryBarLoading}
                                                  setQueryBarLoading={setQueryBarLoading}
                                                  filter={filter}
                                                  setFilter={setFilter}
                                                  searchSettings={searchSettings}
                                                  setSearchSettings={setSearchSettings}
                                                  tags={tags}
                                                  setTags={setTags}
                                                  tagText={tagText}
                                                  setTagText={setTagText}
                                                  cardState={cardState}
                                                  recentQueriesState={recentQueriesState}
                                                  setRecentQueriesState={setRecentQueriesState}
                                                  savedQueriesState={savedQueriesState}
                                                  setSavedQueriesState={setSavedQueriesState}
                                                  setCardState={setCardState}
                                                  settingsModalOpen={settingsModalOpen}
                                                  setSettingsModalOpen={setSettingsModalOpen}
                                                  selectedKeys={selectedKeys}
                                                  setSelectedKeys={setSelectedKeys}
                                                  rowsPerPage={rowsPerPage}
                                                  setRowsPerPage={setRowsPerPage}
                                                  sortDescriptor={sortDescriptor}
                                                  setSortDescriptor={setSortDescriptor}
                                                  tablePage={tablePage}
                                                  setTablePage={setTablePage}
                                                  positions={positions}
                                                  positionSearchText={positionSearchText}
                                                  setPositionSearchText={setPositionSearchText}
                                                  filterModalOpen={filterModalOpen}
                                                  setFilterModalOpen={setFilterModalOpen}
                                                  locationSearchText={locationSearchText}
                                                  setLocationSearchText={setLocationSearchText}
                                                  settingsTab={settingsTab}
                                                  setSettingsTab={setSettingsTab}
                                                />
            : ((activeTab === "recent-queries") ? <RecentQueries 
                recentQueriesState={recentQueriesState}
                setRecentQueriesState={setRecentQueriesState}
                setSavedQueriesState={setSavedQueriesState}
                setTags={setTags}
                setFilter={setFilter}
                setActiveTab={setActiveTab}
                                                />
            : <SavedQueries
                savedQueriesState={savedQueriesState}
                setSavedQueriesState={setSavedQueriesState}
                setTags={setTags}
                setFilter={setFilter}
                setActiveTab={setActiveTab}
            />)}
          </div>
        </section>
    )
  }