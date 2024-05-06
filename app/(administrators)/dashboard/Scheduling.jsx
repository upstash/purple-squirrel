'use client'

import React from 'react';
import {Input} from "@nextui-org/input";
import {Divider} from "@nextui-org/divider";
import {Button} from "@nextui-org/button";
import {Switch} from "@nextui-org/switch";
import {Select, SelectSection, SelectItem} from "@nextui-org/select";

export default function Scheduling({
    scheduling,
    setScheduling,
    schedulingLoading,
    setSchedulingLoading,
    schedulingDone,
    setSchedulingDone,
    schedulingDefault,
    setSchedulingDefault
  }) {
    return (
        <div className="flex items-center justify-center">
        {
          schedulingLoading
          ?
            null
          :
            <div className="flex flex-col gap-3 px-6 py-5 bg-default-50 rounded-medium">
                <div className={schedulingDefault ? 'flex flex-col gap-3 text-default-500' : 'flex flex-col gap-3'}>
                    <div className='flex justify-between items-center'>
                        <h1 className="text-2xl">Scheduling</h1>
                        <div className="flex flex-nowrap items-center gap-2">
                            <h1 className="text-large text-default-900">{schedulingDefault ? "Customize: " : "Back to Default: "}</h1>
                            <Switch defaultSelected={!schedulingDefault} color="primary" onValueChange={ async (isSelected) => {
                                fetch('/api/get-scheduling')
                                    .then((res) => res.json())
                                    .then((data) => {
                                        setScheduling(data);
                                        setSchedulingLoading(false);
                                })
                                setSchedulingDefault(!isSelected)
                            }}></Switch>
                        </div>
                    </div>
                    
                    <Divider/>
                    <div className="flex gap-2 items-center justify-center">
                        <h1 className="text-large whitespace-nowrap"> Digest</h1>
                        <Input className="w-20" isDisabled={schedulingDefault} radius="md" type="number" size="sm" variant="solid" color="default" value={scheduling.applicantCount} onValueChange={(value) => {
                            setScheduling((prev) => {return {...prev, applicantCount: value}});
                        }}/>
                        <h1 className="text-large whitespace-nowrap"> Emails at a Time<span className='text-red-500'>*</span></h1>
                    </div>
                    <div className="flex gap-2 items-center justify-between">
                        <h1 className="text-large whitespace-nowrap"> Next Digestion If Inbox Is Not Empty:</h1>
                        <div className="flex gap-2 items-center">
                            <Input className="w-16" isDisabled={schedulingDefault} radius="md" type="number" size="sm" variant="solid" color="default" value={scheduling.fullDigestionNum} onValueChange={(value) => {
                                setScheduling((prev) => {return {...prev, fullDigestionNum: value}});
                            }}/>
                            <Select 
                                radius="md"
                                size="sm"
                                variant="solid"
                                color="default"
                                className="w-28"
                                isDisabled={schedulingDefault}
                                selectedKeys={new Set([scheduling.fullDigestionInterval])}
                                onSelectionChange={(key) => {
                                    setScheduling((prev) => {return {...prev, fullDigestionInterval: Array.from(key)[0]}});
                                }}
                            >
                                {["minutes", "hours"].map((interval) => (
                                <SelectItem key={interval} value={interval}>
                                    {interval}
                                </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center justify-between">
                        <h1 className="text-large whitespace-nowrap"> Next Digestion If Inbox Is Empty:</h1>
                        <div className="flex gap-2 items-center">
                            <Input className="w-16" isDisabled={schedulingDefault} radius="md" type="number" size="sm" variant="solid" color="default" value={scheduling.emptyDigestionNum} onValueChange={(value) => {
                                setScheduling((prev) => {return {...prev, emptyDigestionNum: value}});
                            }}/>
                            <Select 
                                radius="md"
                                size="sm"
                                variant="solid"
                                color="default"
                                className="w-28"
                                isDisabled={schedulingDefault}
                                selectedKeys={new Set([scheduling.emptyDigestionInterval])}
                                onSelectionChange={(key) => {
                                    setScheduling((prev) => {return {...prev, emptyDigestionInterval: Array.from(key)[0]}});
                                }}
                            >
                                {["minutes", "hours"].map((interval) => (
                                <SelectItem key={interval} value={interval}>
                                    {interval}
                                </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center justify-between">
                        <h1 className="text-large whitespace-nowrap"> Digestion Error Check Every:</h1>
                        <div className="flex gap-2 items-center">
                            <Input className="w-16" isDisabled={schedulingDefault} radius="md" type="number" size="sm" variant="solid" color="default" value={scheduling.routineDigestionNum} onValueChange={(value) => {
                                setScheduling((prev) => {return {...prev, routineDigestionNum: value}});
                            }}/>
                            <Select 
                                radius="md"
                                size="sm"
                                variant="solid"
                                color="default"
                                className="w-28"
                                isDisabled={schedulingDefault}
                                selectedKeys={new Set([scheduling.routineDigestionInterval])}
                                onSelectionChange={(key) => {
                                    setScheduling((prev) => {return {...prev, routineDigestionInterval: Array.from(key)[0]}});
                                }}
                            >
                                {["minutes", "hours"].map((interval) => (
                                <SelectItem key={interval} value={interval}>
                                    {interval}
                                </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>
                    <div className="text-small">
                        <span className='text-red-500'>*</span>Digesting too many emails at a time may cause Vercel serverless function timeout.
                    </div>
                    <Button color="primary" size="lg" radius="md" onPress={async () => {
                            const response = await fetch("/api/set-schedule", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({scheduling: scheduling})
                            });
                            if (response.status !== 200) {
                                console.error("Failed to schedule");
                            } else {
                                setSchedulingDone(true);
                            }
                        }}>
                            Schedule
                        </Button>
                </div>
            </div>
        }
      </div>
    )
  }
