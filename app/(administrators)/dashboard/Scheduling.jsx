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
  }) {
    return (
        <div className="flex items-center justify-center">
        {
          schedulingLoading
          ?
            null
          :
            <div className="flex flex-col gap-3 px-6 py-5 bg-default-50 rounded-medium">
                <div className='flex flex-col gap-3'>
                    <div className="flex gap-2 items-center justify-between">
                        <h1 className="text-large whitespace-nowrap"> Listen Inbox Every</h1>
                        <div className="flex gap-2 items-center">
                            <Input className="w-16" radius="md" type="number" size="sm" variant="solid" color="default" value={scheduling.schedulingNum} onValueChange={(value) => {
                                setScheduling((prev) => {return {...prev, schedulingNum: value}});
                            }}/>
                            <Select 
                                radius="md"
                                size="sm"
                                variant="solid"
                                color="default"
                                className="w-28"
                                selectedKeys={new Set([scheduling.schedulingInterval])}
                                onSelectionChange={(key) => {
                                    setScheduling((prev) => {return {...prev, schedulingInterval: Array.from(key)[0]}});
                                }}
                            >
                                {["minutes", "hours"].map((interval) => (
                                <SelectItem key={interval} value={interval}>
                                    {interval}
                                </SelectItem>
                                ))}
                            </Select>
                            <Button color="primary" size="lg" radius="md" onPress={async () => {
                                const response = await fetch("/api/mail-pipeline/set-settings", {
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
                </div>
            </div>
        }
      </div>
    )
  }
