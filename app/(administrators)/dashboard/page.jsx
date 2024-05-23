'use client'

import React, { useState, useEffect } from 'react';
import {SquirrelIcon} from '@primer/octicons-react'
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import {Tabs, Tab} from "@nextui-org/react";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import PositionBar from "@/app/(administrators)/components/PositionBar";
import PositionTable from "@/app/(administrators)/components/PositionTable";
import UserTable from "@/app/(administrators)/components/UserTable";
import Applications from '@/app/(administrators)/components/Applications';

function getTabColor(tab) {
    if (tab === "positions") {
        return "danger";
    } else if (tab === "applications") {
        return "primary";
    } else if (tab === "users") {
        return "secondary";
    }
  }

export default function Page() {
    const [activeTab, setActiveTab] = useState("positions");

    const [positions, setPositions] = useState([]);
    const [positionsLoading, setPositionsLoading] = useState(true);
    const [positionOpenText, setPositionOpenText] = useState("");
    const [positionSearchText, setPositionSearchText] = useState("");

    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [tablePage, setTablePage] = React.useState(1);
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

    const [scheduling, setScheduling] = useState({});

    const [schedulingLoading, setSchedulingLoading] = useState(true);

    const [methodsSelected, setMethodsSelected] = React.useState(["mail", "ps"]);

    const [methodSaved, setMethodSaved] = React.useState(false);

    const [users, setUsers] = useState([]);
    const [userSearchText, setUserSearchText] = useState("");
    const [usersLoading, setUsersLoading] = useState(false);
    const [roleFilter, setRoleFilter] = React.useState("all");
    const [userRowsPerPage, setUserRowsPerPage] = React.useState(10);
    const [userTablePage, setUserTablePage] = React.useState(1);
    const [selectedUserKeys, setSelectedUserKeys] = React.useState(new Set([]));

    useEffect(() => {
        fetch('/api/positions/get-positions')
          .then((res) => res.json())
          .then((data) => {
            setPositions(data);
            setPositionsLoading(false);
          })
      }, [setPositions, setPositionsLoading]);

    useEffect(() => {
        fetch('/api/settings/get-settings')
            .then((res) => res.json())
            .then((data) => {
                setMethodsSelected(data.methods);
                setScheduling(data.scheduling);
                setSchedulingLoading(false);
            })
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
                        <Tabs key={"primary"} color={getTabColor(activeTab)} aria-label="Tabs colors" selectedKey={activeTab} radius="full" onSelectionChange={(key) => {
                            setActiveTab(key);
                        }}>
                            <Tab key="positions" title="Positions"/>
                            <Tab key="applications" title="Applications"/>
                            <Tab key="users" title="Users"/>
                        </Tabs>
                    </div>
                    <div className="flex-1 flex items-center justify-end">
                        <div className="flex gap-2">
                            <Button isIconOnly color={getTabColor(activeTab)} variant="light" radius="full" size="sm" href="/console" as={Link}>
                                <TerminalOutlinedIcon />
                            </Button>
                            <ThemeSwitcher color={getTabColor(activeTab)} />
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-auto px-unit-4 pb-unit-4">
                {(activeTab === "positions")
                ?
                    <div className="flex flex-col h-full">
                        <div className="flex-initial pb-unit-2">
                            <PositionBar 
                                positions={positions}
                                setPositions={setPositions}
                                positionsLoading={positionsLoading}
                                setPositionsLoading={setPositionsLoading}
                                positionOpenText={positionOpenText}
                                setPositionOpenText={setPositionOpenText}
                            />
                        </div>
                        <div className="flex-auto flex h-full">
                            <div className="flex-[72_1_0%] pt-unit-2 transition-all duration-300 ease-in-out">
                                <div className="flex flex-col bg-default-50 rounded-medium h-full p-unit-3">
                                <PositionTable
                                        positions={positions}
                                        setPositions={setPositions}
                                        positionsLoading={positionsLoading}
                                        setPositionsLoading={setPositionsLoading}
                                        positionSearchText={positionSearchText}
                                        setPositionSearchText={setPositionSearchText}
                                        statusFilter={statusFilter}
                                        setStatusFilter={setStatusFilter}
                                        rowsPerPage={rowsPerPage}
                                        setRowsPerPage={setRowsPerPage}
                                        tablePage={tablePage}
                                        setTablePage={setTablePage}
                                        selectedKeys={selectedKeys}
                                        setSelectedKeys={setSelectedKeys}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    (activeTab === "applications")
                    ?
                        <Applications 
                            scheduling={scheduling}
                            setScheduling={setScheduling}
                            schedulingLoading={schedulingLoading}
                            setSchedulingLoading={setSchedulingLoading}
                            methodsSelected={methodsSelected}
                            setMethodsSelected={setMethodsSelected}
                            methodSaved={methodSaved}
                            setMethodSaved={setMethodSaved}
                        />
                    :
                        <div className="flex flex-col h-full">
                            <div className="flex-auto flex h-full">
                                <div className="flex-[72_1_0%] transition-all duration-300 ease-in-out">
                                    <div className="flex flex-col bg-default-50 rounded-medium h-full p-unit-3">
                                    <UserTable
                                            users={users}
                                            setUsers={setUsers}
                                            userSearchText={userSearchText}
                                            setUserSearchText={setUserSearchText}
                                            usersLoading={usersLoading}
                                            setUsersLoading={setUsersLoading}
                                            roleFilter={roleFilter}
                                            setRoleFilter={setRoleFilter}
                                            userRowsPerPage={userRowsPerPage}
                                            setUserRowsPerPage={setUserRowsPerPage}
                                            userTablePage={userTablePage}
                                            setUserTablePage={setUserTablePage}
                                            selectedUserKeys={selectedUserKeys}
                                            setSelectedUserKeys={setSelectedUserKeys}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div> 
        </section>
    )
  }
  