'use client'

import React, { useState, useEffect } from 'react';
import {SquirrelIcon} from '@primer/octicons-react'
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import TerminalOutlinedIcon from '@mui/icons-material/TerminalOutlined';
import {Tabs, Tab} from "@nextui-org/react";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import ApplyTable from "./ApplyTable";
import AppliedTable from "./AppliedTable";
import {Input} from "@nextui-org/input";

function getTabColor(tab) {
    if (tab === "positions") {
        return "secondary";
    } else if (tab === "applied") {
        return "primary";
    }
  }

export default function Page() {
    const [activeTab, setActiveTab] = useState("positions");

    const [positions, setPositions] = useState([]);
    const [positionsLoading, setPositionsLoading] = useState(true);
    const [positionSearchText, setPositionSearchText] = useState("");

    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [tablePage, setTablePage] = React.useState(1);


    const [appliedPositions, setAppliedPositions] = useState([]);
    const [appliedPositionsLoading, setAppliedPositionsLoading] = useState(true);
    const [appliedPositionSearchText, setAppliedPositionSearchText] = useState("");

    const [appliedRowsPerPage, setAppliedRowsPerPage] = React.useState(10);
    const [appliedTablePage, setAppliedTablePage] = React.useState(1);


    useEffect(() => {
        fetch('/api/application/get-open-positions')
          .then((res) => res.json())
          .then((data) => {
            setPositions(data);
            setPositionsLoading(false);
          })
      }, [setPositions, setPositionsLoading]);


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
                            <Tab key="positions" title="Open Positions"/>
                            <Tab key="applied" title="Applied Positions"/>
                        </Tabs>
                    </div>
                    <div className="flex-1 flex items-center justify-end">
                        <ThemeSwitcher color={getTabColor(activeTab)} />
                    </div>
                </div>
            </header>
            <div className="flex-auto px-unit-4 pb-unit-4">
                {(activeTab === "positions")
                ?
                    <div className="flex flex-col h-full">
                      <div className="flex-initial pb-unit-2">
                          <Input classNames={{inputWrapper: "bg-default-50"}} value={positionSearchText} onValueChange={setPositionSearchText} placeholder="Search by name..." size="sm" radius="md" />
                      </div>
                      <div className="flex-auto flex h-full">
                          <div className="flex-[72_1_0%] pt-unit-2 transition-all duration-300 ease-in-out">
                              <ApplyTable
                                      positions={positions}
                                      setPositions={setPositions}
                                      positionsLoading={positionsLoading}
                                      setPositionsLoading={setPositionsLoading}
                                      positionSearchText={positionSearchText}
                                      setPositionSearchText={setPositionSearchText}
                                      rowsPerPage={rowsPerPage}
                                      setRowsPerPage={setRowsPerPage}
                                      tablePage={tablePage}
                                      setTablePage={setTablePage}
                                  />
                          </div>
                      </div>
                    </div>
                :
                    <div className="flex flex-col h-full">
                      <div className="flex-initial pb-unit-2">
                          <Input classNames={{inputWrapper: "bg-default-50"}} value={appliedPositionSearchText} onValueChange={setAppliedPositionSearchText} placeholder="Search by name..." size="sm" radius="md" />
                      </div>
                      <div className="flex-auto flex h-full">
                          <div className="flex-[72_1_0%] pt-unit-2 transition-all duration-300 ease-in-out">
                            <AppliedTable
                                      appliedPositions={appliedPositions}
                                      setAppliedPositions={setAppliedPositions}
                                      appliedPositionsLoading={appliedPositionsLoading}
                                      setAppliedPositionsLoading={setAppliedPositionsLoading}
                                      appliedPositionSearchText={appliedPositionSearchText}
                                      setAppliedPositionSearchText={setAppliedPositionSearchText}
                                      appliedRowsPerPage={appliedRowsPerPage}
                                      setAppliedRowsPerPage={setAppliedRowsPerPage}
                                      appliedTablePage={appliedTablePage}
                                      setAppliedTablePage={setAppliedTablePage}
                                  />
                          </div>
                      </div>
                    </div>
                    }
            </div> 
        </section>
    )
  }
  