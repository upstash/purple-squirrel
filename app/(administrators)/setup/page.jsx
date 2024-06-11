'use client'

import { Divider } from '@nextui-org/react'
import React, { useState, useEffect } from 'react';
import {SquirrelIcon} from '@primer/octicons-react'
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import {Tabs, Tab} from "@nextui-org/react";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import PositionBar from "@/app/(administrators)/components/PositionBar";
import PositionTable from "@/app/(administrators)/components/PositionTable";
import Applications from '@/app/(administrators)/components/Applications';

import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';

function getTabColor(tab) {
    if (tab === "start") {
      return "warning";
    } else if (tab === "positions") {
      return "danger";
    } else if (tab === "applications") {
      return "primary";
    } else if (tab === "complete") {
      return "success";
    }
  }

function getDisabledKeys(tab) {
    if (tab === "start") {
        return ["complete", "applications"];
    } else if (tab === "positions") {
        return ["complete", "applications"];
    } else if (tab === "applications") {
        return ["start", "positions", "complete"];
    } else if (tab === "complete") {
        return ["start", "positions", "applications"];
    }
}

export default function Page() {
    const [activeTab, setActiveTab] = useState("start");

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
                        }} disabledKeys={getDisabledKeys(activeTab)}>
                            <Tab key="start" title="Start"/>
                            <Tab key="positions" title="Positions"/>
                            <Tab key="applications" title="Applications"/>
                            <Tab key="complete" title="Complete"/>
                        </Tabs>
                    </div>
                    <div className="flex-1 flex items-center justify-end">
                        <div className="flex gap-2">
                            <ThemeSwitcher color={getTabColor(activeTab)} />
                        </div>
                    </div>
                </div>
            </header>
            <div className="flex-initial px-unit-4 pb-unit-4">
                {
                    (activeTab === "start")
                    ?
                        <div className="flex items-center justify-center">
                            <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium border-1">
                                <div className="flex flex-col gap-2 py-2">
                                    <h2 className="text-3xl text-center text-default-900">Let&apos;s Setup Purple Squirrel!</h2>
                                    <h2 className="text-lg text-center text-default-600">We will setup open positions and accepted application methods.</h2>
                                </div>
                                <div className="flex justify-end">
                                    <Button color="secondary" size="md" radius="md" endContent={<EastOutlinedIcon />} onPress={() => setActiveTab("positions")}>
                                        Positions
                                    </Button>
                                </div>
                            </div>
                        </div>
                    :
                        (activeTab === "positions")
                        ?
                            <div className="bg-default-50 rounded-medium px-unit-2 py-unit-3 h-full flex flex-col border-1">
                                <div className="flex items-center justify-between gap-2 pl-unit-1 text-default-900">
                                    <Button color="warning" size="md" radius="md" startContent={<WestOutlinedIcon />} onPress={() => setActiveTab("start")}>
                                        Start
                                    </Button>
                                    <h2>Setup open positions here. You can change them later at Admin Dashboard.</h2>
                                    <Button color="primary" size="md" radius="md" endContent={<EastOutlinedIcon />} onPress={() => setActiveTab("applications")}>
                                        Applications
                                    </Button>
                                </div>
                            </div>
                        :
                            (activeTab === "applications")
                            ?
                                <div className="bg-default-50 rounded-medium px-unit-2 py-unit-3 h-full flex flex-col border-1">
                                    <div className="flex items-center justify-between gap-2 pl-unit-1 text-default-900">
                                        <div className="w-32"></div>
                                        <div>
                                            <h2>Setup your application methods and mail inbox listening schedule here. You can change it later at Admin Dashboard.</h2>
                                        </div>
                                        <Button isDisabled={!methodSaved} color={!methodSaved? "default" : "success" } size="md" radius="md" endContent={<EastOutlinedIcon />} onPress={async () => {
                                            setActiveTab("complete");
                                        }}>
                                            Complete
                                        </Button>
                                    </div>
                                </div>
                            :

                                <div className="flex items-center justify-center">
                                    <div className="flex flex-col gap-3 p-6 bg-default-50 rounded-medium border-1">
                                        <div className="flex flex-col gap-2 py-2">
                                            <h2 className="text-3xl text-center text-default-900">Your setup is complete!</h2>
                                            <h2 className="text-lg text-center text-default-600">Applicants from unread mails will appear shortly.</h2>
                                        </div>
                                        <div className="flex flex-col mt-2 gap-2">
                                            <Button size="lg" variant="solid" color="secondary" className="text-large" as={Link} href="/console" startContent={<TerminalOutlinedIcon />}>Recruiter Console</Button>
                                            <Button size="lg" variant="bordered" color="secondary" className="text-large" as={Link} href="/dashboard" startContent={<AdminPanelSettingsOutlinedIcon />}>Admin Dashboard</Button>
                                        </div>
                                    </div>
                                </div>
                }
            </div>
            <div className="flex-auto px-unit-4 pb-unit-4">
                {(activeTab === "start")
                ?
                    null
                :
                    (activeTab === "positions")
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
                            null
                }
            </div> 
        </section>
    )
  }
  