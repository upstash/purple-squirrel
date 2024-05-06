'use client'

import React from 'react';
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {Skeleton} from "@nextui-org/skeleton";

export default function PositionBar({
    positions,
    setPositions,
    positionsLoading,
    positionOpenText,
    setPositionOpenText,
  }) {
    return (
            <div className="bg-default-50 rounded-medium px-unit-2 py-unit-3 h-full flex flex-col">
                <div className="flex items-center">
                    {
                        positionsLoading
                        ?
                            <Skeleton className="flex-auto mx-unit-1 h-unit-10 rounded-medium"></Skeleton>
                        :
                            <div className="flex-auto px-unit-1 w-full">
                                <Input size="sm" radius="md" placeholder="Enter a position name..." value={positionOpenText} onValueChange={(value) => setPositionOpenText((prev) => {return value;})} classNames={{inputWrapper: "h-unit-10 bg-default-100"}} />
                            </div>
                    }
                    {
                        positionsLoading
                        ?
                            <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-20 rounded-medium"></Skeleton>
                        :
                            (
                                <div className="flex-initial px-unit-1">
                                    <Button color="danger" size="md" radius="md" onPress={
                                        async () => {
                                            if (positions.filter((position) => {return position.name === positionOpenText;}).length > 0) {
                                                alert("Position already exists.");
                                                return;
                                            }
                                            await fetch("/api/push-position", {
                                                method: "POST",
                                                headers: {
                                                "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({name: positionOpenText, status: "open"})
                                            });
                                            setPositions((prev) => {
                                                const newPositions = [...prev];
                                                newPositions.unshift({name: positionOpenText, status: "open"});
                                                return newPositions;
                                            });
                                            setPositionOpenText("");
                                        }
                                    }>
                                        Open
                                    </Button>
                                </div>
                            )
                    }
                </div>
            </div>
    )
  }
