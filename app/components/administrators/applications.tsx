"use client";

import React from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Select, SelectItem } from "@nextui-org/select";
import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { cn } from "@nextui-org/react";

import { useAdmin } from "@/app/managers";
import { isScheduling } from "@/types/validations";

export function Applications() {
  const {
    scheduling,
    setScheduling,
    schedulingLoading,
    methodsSelected,
    setMethodsSelected,
    methodSaved,
    setMethodSaved,
  } = useAdmin();
  return (
    <div className="flex items-center justify-center">
      {schedulingLoading ? null : (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 px-6 py-5 bg-default-50 rounded-medium">
            <div>
              <h1 className="text-xl">Select Application Methods</h1>
            </div>
            <CheckboxGroup
              value={methodsSelected}
              onChange={(value) => {
                if (Array.isArray(value) && value.length > 0) {
                  setMethodsSelected(value);
                }
              }}
              classNames={{
                base: "w-full",
              }}
            >
              <Checkbox
                aria-label="mail"
                classNames={{
                  base: cn(
                    "inline-flex max-w-md w-full bg-content1 m-0",
                    "hover:bg-content2 items-center justify-start",
                    "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                  ),
                  label: "w-full",
                }}
                value="mail"
                color="primary"
              >
                <div className="w-full flex justify-between gap-2">
                  <div className="flex flex-col">
                    <h4
                      className={
                        methodsSelected.includes("mail")
                          ? "text-lg text-primary"
                          : "text-lg"
                      }
                    >
                      Mail
                    </h4>
                    <p className="text-default-500 text-md">
                      Take applications from your email inbox.
                    </p>
                  </div>
                </div>
              </Checkbox>
              <Checkbox
                aria-label="ps"
                classNames={{
                  base: cn(
                    "inline-flex max-w-md w-full bg-content1 m-0",
                    "hover:bg-content2 items-center justify-start",
                    "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-secondary"
                  ),
                  label: "w-full",
                }}
                value="ps"
                color="secondary"
              >
                <div className="w-full flex justify-between gap-2">
                  <div className="flex flex-col">
                    <h4
                      className={
                        methodsSelected.includes("ps")
                          ? "text-lg text-secondary"
                          : "text-lg"
                      }
                    >
                      Purple Squirrel
                    </h4>
                    <p className="text-default-500 text-md">
                      Allow applicants to apply through Purple Squirrel.
                    </p>
                  </div>
                </div>
              </Checkbox>
            </CheckboxGroup>
          </div>
          <div className="flex flex-col gap-3 px-6 py-5 bg-default-50 rounded-medium">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 items-center justify-between">
                <h1
                  className={
                    methodsSelected.includes("mail")
                      ? "text-large whitespace-nowrap"
                      : "text-large text-default-400 whitespace-nowrap"
                  }
                >
                  {" "}
                  Listen Inbox Every
                </h1>
                <div className="flex gap-2 items-center">
                  <Input
                    isDisabled={!methodsSelected.includes("mail")}
                    className="w-16"
                    radius="md"
                    type="number"
                    size="sm"
                    variant="flat"
                    color="default"
                    value={
                      isScheduling(scheduling)
                        ? scheduling.schedulingNum.toString()
                        : undefined
                    }
                    onValueChange={(value) => {
                      setScheduling((prev) => {
                        return { ...prev, schedulingNum: value };
                      });
                    }}
                  />
                  <Select
                    radius="md"
                    size="sm"
                    variant="flat"
                    color="default"
                    className="w-28"
                    selectedKeys={
                      isScheduling(scheduling)
                        ? new Set([scheduling.schedulingInterval])
                        : new Set()
                    }
                    isDisabled={!methodsSelected.includes("mail")}
                    onSelectionChange={(key) => {
                      setScheduling((prev) => {
                        return {
                          ...prev,
                          schedulingInterval: Array.from(key)[0],
                        };
                      });
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
            </div>
          </div>
          <Button
            color="primary"
            size="lg"
            radius="md"
            onPress={async () => {
              const response = await fetch("/api/settings/set-settings", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  scheduling: scheduling,
                  methods: methodsSelected,
                }),
              });
              if (response.status !== 200) {
                console.error("Failed to save");
              } else {
                setMethodSaved(true);
              }
            }}
          >
            Set
          </Button>
        </div>
      )}
    </div>
  );
}
