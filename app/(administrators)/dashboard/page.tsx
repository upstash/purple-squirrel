"use client";

import React, { useState, useEffect } from "react";
import { SquirrelIcon } from "@primer/octicons-react";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import TerminalOutlinedIcon from "@mui/icons-material/TerminalOutlined";
import { Tabs, Tab } from "@nextui-org/react";
import { ThemeSwitcher } from "@/app/components/theme/theme-switcher";
import {
  Applications,
  PositionBar,
  PositionTable,
  UserTable,
} from "@/app/components/administrators";
import { DashboardTab, NextUIColor } from "@/types";
import { isDashboardTab } from "@/types/validations";
import { useAdmin } from "@/app/managers";

function getTabColor(tab: DashboardTab): NextUIColor {
  if (tab === "positions") {
    return "danger";
  } else if (tab === "applications") {
    return "primary";
  } else if (tab === "users") {
    return "secondary";
  }
}

export default function Page() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("positions");

  const {
    setPositions,
    positions,
    positionsLoading,
    setPositionsLoading,
    positionOpenText,
    setPositionOpenText,
    positionSearchText,
    setPositionSearchText,
    statusFilter,
    setStatusFilter,
    rowsPerPage,
    setRowsPerPage,
    tablePage,
    setTablePage,
    selectedKeys,
    setSelectedKeys,
    users,
    setUsers,
    userSearchText,
    setUserSearchText,
    usersLoading,
    setUsersLoading,
    roleFilter,
    setRoleFilter,
    userRowsPerPage,
    setUserRowsPerPage,
    userTablePage,
    setUserTablePage,
    selectedUserKeys,
    setSelectedUserKeys,
    scheduling,
    setScheduling,
    schedulingLoading,
    methodsSelected,
    setMethodsSelected,
    methodSaved,
    setMethodSaved,
    setSchedulingLoading,
  } = useAdmin();

  useEffect(() => {
    fetch("/api/positions/get-positions")
      .then((res) => res.json())
      .then((data) => {
        setPositions(data);
        setPositionsLoading(false);
      });
  }, [setPositions, setPositionsLoading]);

  useEffect(() => {
    fetch("/api/settings/get-settings")
      .then((res) => res.json())
      .then((data) => {
        setMethodsSelected(data.methods);
        setScheduling(data.scheduling);
        setSchedulingLoading(false);
      });
  }, [setScheduling, setSchedulingLoading, setMethodsSelected]);

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
            <Tabs
              key={"primary"}
              color={getTabColor(activeTab)}
              aria-label="Tabs colors"
              selectedKey={activeTab}
              radius="full"
              onSelectionChange={(key) => {
                if (typeof key === "string" && isDashboardTab(key)) {
                  setActiveTab(key);
                }
              }}
            >
              <Tab key="positions" title="Positions" />
              <Tab key="applications" title="Applications" />
              <Tab key="users" title="Users" />
            </Tabs>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <div className="flex gap-2">
              <Button
                isIconOnly
                color={getTabColor(activeTab)}
                variant="light"
                radius="full"
                size="sm"
                href="/console"
                as={Link}
              >
                <TerminalOutlinedIcon />
              </Button>
              <ThemeSwitcher color={getTabColor(activeTab)} />
            </div>
          </div>
        </div>
      </header>
      <div className="flex-auto px-unit-4 pb-unit-4">
        {activeTab === "positions" ? (
          <div className="flex flex-col h-full">
            <div className="flex-initial pb-unit-2">
              <PositionBar />
            </div>
            <div className="flex-auto flex h-full">
              <div className="flex-[72_1_0%] pt-unit-2 transition-all duration-300 ease-in-out">
                <div className="flex flex-col bg-default-50 rounded-medium h-full p-unit-3">
                  <PositionTable />
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "applications" ? (
          <Applications />
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-auto flex h-full">
              <div className="flex-[72_1_0%] transition-all duration-300 ease-in-out">
                <div className="flex flex-col bg-default-50 rounded-medium h-full p-unit-3">
                  <UserTable />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
