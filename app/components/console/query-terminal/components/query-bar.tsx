"use client";

import React from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Slider } from "@nextui-org/slider";
import { Tooltip } from "@nextui-org/tooltip";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Divider } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/skeleton";
import { v4 as uuidv4 } from "uuid";
import { Chip } from "@nextui-org/chip";
import { Switch } from "@nextui-org/switch";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Tabs, Tab } from "@nextui-org/tabs";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import NextWeekOutlinedIcon from "@mui/icons-material/NextWeekOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";

import filterCoder from "@/app/utils/filter-coder";

import {
  LOCATIONS,
  LOCATION_LOOKUP,
  APPLICANT_STATUS_OPTIONS,
} from "@/app/constants";

import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";

import { useQueryTerminal, useQueries } from "@/app/managers";

import type { Query } from "@/types";

import { isApplicantRowArray, isApplicantRow } from "@/types/validations";
import { applicantRowSchema } from "@/types/schemas";

import { getApplicantStatusColor } from "@/app/utils";

import "./autocomplete.css";

const statusOptions = [
  { name: "All", uid: "All" },
  { name: "New", uid: "newApply" },
  { name: "Screening", uid: "screening" },
  { name: "Assessment", uid: "assessment" },
  { name: "Interview", uid: "interview" },
  { name: "Shortlisted", uid: "shortlisted" },
  { name: "Offer", uid: "offer" },
  { name: "Onboarding", uid: "onboarding" },
  { name: "Hired", uid: "hired" },
];

const statusSet = new Set(statusOptions.map((status) => status.uid));
statusSet.delete("All");

export function QueryBar() {
  const {
    query,
    setQuery,
    positions,
    searchSettings,
    setSearchSettings,
    tableLoading,
    setTableLoading,
    setApplicants,
    applicantCard,
    setApplicantCard,
    queryBarLoading,
    tagText,
    setTagText,
    settingsModalOpen,
    setSettingsModalOpen,
    settingsTab,
    setSettingsTab,
    locationSearchText,
    setLocationSearchText,
  } = useQueryTerminal();

  const { setRecentQueries } = useQueries();

  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };
  const queryID = query.id;
  const tags = query.tags;
  const filter = query.filter;

  return (
    <div className="bg-default-50 rounded-medium px-unit-2 py-unit-3 h-full flex flex-col">
      <div className="flex items-center">
        {queryBarLoading ? (
          <Skeleton className="flex-auto mx-unit-1 h-unit-10 rounded-medium"></Skeleton>
        ) : (
          <div className="flex-auto px-unit-1 w-full">
            <Input
              label={null}
              size="sm"
              radius="md"
              className="w-full"
              placeholder="Write qualities, separate with Enter Key..."
              classNames={{ inputWrapper: "h-unit-10 bg-default-100" }}
              value={tagText}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  setQuery((prev) => {
                    return {
                      ...prev,
                      tags: [...prev.tags, tagText],
                    };
                  });
                  setTagText("");
                }
              }}
              onValueChange={(value) => setTagText(value)}
            />
          </div>
        )}
        {queryBarLoading ? (
          <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-96 rounded-medium"></Skeleton>
        ) : (
          <div className="flex-initial px-unit-1">
            <Autocomplete
              isRequired
              placeholder="Position*"
              size="sm"
              radius="md"
              className="w-96 styled-autocomplete"
              selectedKey={filter.positionFilter.toString()}
              onSelectionChange={(key) => {
                setQuery((prev) => {
                  if (!key) {
                    return {
                      ...prev,
                      filter: { ...prev.filter, positionFilter: 1 },
                    };
                  }
                  return {
                    ...prev,
                    filter: { ...prev.filter, positionFilter: Number(key) },
                  };
                });
              }}
            >
              {positions.map((position) => (
                <AutocompleteItem key={position.id} value={position.id}>
                  {position.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </div>
        )}
        {queryBarLoading ? (
          <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-[7.40rem] rounded-medium"></Skeleton>
        ) : (
          <div className="flex-initial px-unit-1">
            <Button
              color={searchSettings.flash ? "primary" : "warning"}
              size="md"
              radius="md"
              variant="solid"
              className="text-md pr-5"
              startContent={
                searchSettings.flash ? (
                  <BoltIcon />
                ) : (
                  <SearchOutlinedIcon className="text-2xl" />
                )
              }
              isDisabled={
                tableLoading.status ||
                tags.length === 0 ||
                !filter.positionFilter
              }
              onPress={async () => {
                if (tableLoading.status) {
                  return;
                }
                if (tags.length === 0) {
                  return;
                }
                if (!filter.positionFilter) {
                  return;
                }
                setTableLoading({
                  status: true,
                  color: searchSettings.flash ? "primary" : "secondary",
                  text: "Finding Applicants...",
                });
                try {
                  const data = {
                    tags: tags,
                    positionId: filter.positionFilter,
                    positionTitle: positions.filter(
                      (position) => position.id == filter.positionFilter
                    )[0].name,
                    filter: filterCoder(filter),
                    searchSettings: searchSettings,
                    rankType: searchSettings.flash ? "flash" : "deep",
                  };
                  setRecentQueries((prev: Query[]) => {
                    return [
                      { id: queryID, tags: tags, filter: filter },
                      ...prev,
                    ];
                  });
                  const [rankResponse, redisResponse] = await Promise.all([
                    fetch("/api/query/rank", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(data),
                    }),
                    fetch("/api/query/push-recent-query", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: queryID,
                        tags: tags,
                        filter: filter,
                      }),
                    }),
                  ]);
                  const rankResponseData = await rankResponse.json();
                  console.log(rankResponseData);
                  if (rankResponseData.status === 200) {
                    const rankApplicants = rankResponseData.rankedApplicants
                    for (const triplet of rankApplicants) {
                      if (!applicantRowSchema.safeParse(triplet).success) {
                        console.error("Invalid response data");
                        console.error(triplet);
                        console.error(applicantRowSchema.safeParse(triplet));
                        break;
                      }
                    }
                    if (!isApplicantRowArray(rankApplicants)) {
                      console.error("Invalid response data");
                      setTableLoading((prev) => {
                        return { ...prev, status: false };
                      });
                      return;
                    }
                    setApplicants(rankApplicants);
                    if (applicantCard.display) {
                      const displayTripletArray = rankApplicants.filter(
                        (triplet) => triplet.id === applicantCard.id
                      );
                      if (displayTripletArray.length > 0) {
                        setApplicantCard((prev) => {
                          return {
                            ...prev,
                            ...displayTripletArray[0],
                          };
                        });
                      } else {
                        if (
                          applicantCard.display &&
                          applicantCard.applicantInfo.notes
                        ) {
                          await fetch(`/api/console/set-applicant-notes`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              id: applicantCard.id,
                              notes: applicantCard.applicantInfo.notes,
                            }),
                          });
                        }
                        setApplicantCard({ display: false });
                      }
                    }
                    setTableLoading((prev) => {
                      return { ...prev, status: false };
                    });
                  } else if (rankResponseData.status === 500) {
                    console.error(rankResponseData.message);
                  } else {
                    console.error("Unknown error");
                  }
                  setTableLoading((prev) => {
                    return { ...prev, status: false };
                  });
                } catch (error) {
                  console.error(error);
                  setTableLoading((prev) => {
                    return { ...prev, status: false };
                  });
                }
              }}
            >
              Search
            </Button>
          </div>
        )}
        {queryBarLoading ? (
          <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-10 rounded-medium"></Skeleton>
        ) : (
          <div className="flex-initial px-unit-1">
            <Popover
              placement="bottom"
              isOpen={settingsModalOpen}
              onOpenChange={async (open) => {
                setSettingsModalOpen(open);
                if (!open) {
                  await fetch("/api/settings/save-search-settings", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(searchSettings),
                  });
                }
              }}
            >
              <PopoverTrigger>
                <Button isIconOnly color="secondary" size="md" variant="solid">
                  <Tooltip
                    content="Settings"
                    color={"secondary"}
                    delay={400}
                    closeDelay={600}
                  >
                    <TuneOutlinedIcon />
                  </Tooltip>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="py-1">
                  <div className="flex flex-col gap-2">
                    <Tabs
                      fullWidth
                      key={"primary"}
                      color={
                        settingsTab === "filters"
                          ? "secondary"
                          : searchSettings.flash
                          ? "primary"
                          : "warning"
                      }
                      aria-label="Tabs colors"
                      classNames={{ tabList: "bg-content1 shadow-medium" }}
                      selectedKey={settingsTab}
                      onSelectionChange={(key) => {
                        if (key === "filters" || key === "ranking") {
                          setSettingsTab(key);
                        }
                      }}
                    >
                      <Tab key="filters" title="Filters" />
                      <Tab key="ranking" title="Ranking" />
                    </Tabs>
                    {settingsTab === "filters" ? (
                      <Accordion
                        showDivider={false}
                        className="p-2 flex flex-col gap-1 w-[25vw]"
                        variant="shadow"
                        itemClasses={itemClasses}
                      >
                        <AccordionItem
                          key="1"
                          aria-label="Location"
                          classNames={{
                            subtitle:
                              filter.countryCodeFilter.length === 0
                                ? null
                                : "text-primary",
                          }}
                          startContent={
                            <PublicOutlinedIcon className="text-primary" />
                          }
                          subtitle={
                            filter.countryCodeFilter.length === 0
                              ? "Any"
                              : `${filter.countryCodeFilter.length} Selected`
                          }
                          title="Location"
                        >
                          <div className="flex flex-col px-1 py-2 w-full">
                            <Input
                              isClearable
                              placeholder="Enter a location..."
                              onClear={() => {
                                setLocationSearchText((prev) => {
                                  return "";
                                });
                              }}
                              size="sm"
                              className="w-full"
                              value={locationSearchText}
                              onValueChange={(value) =>
                                setLocationSearchText((prev) => {
                                  return value;
                                })
                              }
                              classNames={{
                                inputWrapper: "h-unit-10 bg-default-100",
                              }}
                            ></Input>
                            {locationSearchText.length < 3 ? (
                              filter.countryCodeFilter.length === 0 ? null : (
                                <ScrollShadow
                                  size={5}
                                  className="max-h-24 flex flex-col gap-2 mt-2"
                                >
                                  <div className="flex flex-col">
                                    {filter.countryCodeFilter.map(
                                      (countryCode) => {
                                        return (
                                          <Button
                                            size="sm"
                                            key={countryCode}
                                            variant="light"
                                            color="primary"
                                            onPress={() => {
                                              setQuery((prev) => {
                                                return {
                                                  ...prev,
                                                  filter: {
                                                    ...prev.filter,
                                                    countryCodeFilter:
                                                      prev.filter.countryCodeFilter.filter(
                                                        (id) => {
                                                          return (
                                                            id !== countryCode
                                                          );
                                                        }
                                                      ),
                                                  },
                                                };
                                              });
                                            }}
                                          >
                                            <div className="flex justify-between w-full text-sm text-left">
                                              {countryCode
                                                ? LOCATION_LOOKUP[countryCode]
                                                : "Unknown"}
                                            </div>
                                          </Button>
                                        );
                                      }
                                    )}
                                  </div>
                                </ScrollShadow>
                              )
                            ) : (
                              <ScrollShadow
                                size={5}
                                className="max-h-24 flex flex-col gap-1 mt-2"
                              >
                                <div className="flex flex-col">
                                  {LOCATIONS.filter((location) => {
                                    return location.name
                                      .toLowerCase()
                                      .includes(
                                        locationSearchText.toLowerCase()
                                      );
                                  }).map((location) => {
                                    const checked =
                                      filter.countryCodeFilter.includes(
                                        location.iso2
                                      );
                                    return (
                                      <Button
                                        size="sm"
                                        key={location.iso2}
                                        variant="light"
                                        color={checked ? "primary" : "default"}
                                        onPress={() => {
                                          if (checked) {
                                            setQuery((prev) => {
                                              return {
                                                ...prev,
                                                filter: {
                                                  ...prev.filter,
                                                  countryCodeFilter:
                                                    prev.filter.countryCodeFilter.filter(
                                                      (id) => {
                                                        return (
                                                          id !== location.iso2
                                                        );
                                                      }
                                                    ),
                                                },
                                              };
                                            });
                                          } else {
                                            setQuery((prev) => {
                                              return {
                                                ...prev,
                                                filter: {
                                                  ...prev.filter,
                                                  countryCodeFilter: [
                                                    ...prev.filter
                                                      .countryCodeFilter,
                                                    location.iso2,
                                                  ],
                                                },
                                              };
                                            });
                                          }
                                        }}
                                      >
                                        <div className="flex justify-between w-full text-sm text-left">
                                          {location.name}
                                        </div>
                                      </Button>
                                    );
                                  })}
                                </div>
                              </ScrollShadow>
                            )}
                          </div>
                        </AccordionItem>
                        <AccordionItem
                          key="2"
                          aria-label="Status"
                          classNames={{
                            subtitle:
                              filter.statusFilter.length === 0
                                ? null
                                : "text-success",
                          }}
                          startContent={
                            <NextWeekOutlinedIcon className="text-success" />
                          }
                          subtitle={
                            filter.statusFilter.length === 0
                              ? "Any"
                              : `${filter.statusFilter.length} Selected`
                          }
                          title="Status"
                        >
                          <div className="flex flex-col gap-2 justify-center">
                            <div className="flex flex-row gap-2 justify-center">
                              {(
                                [
                                  "newApply",
                                  "screening",
                                  "assessment",
                                  "interview",
                                ] as const
                              ).map((key) => {
                                const noFilter =
                                  filter.statusFilter.length === 0;
                                const statusChecked =
                                  filter.statusFilter.includes(key);
                                return (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      if (noFilter) {
                                        setQuery((prev) => {
                                          return {
                                            ...prev,
                                            filter: {
                                              ...prev.filter,
                                              statusFilter:
                                                APPLICANT_STATUS_OPTIONS.filter(
                                                  (id) => {
                                                    return id !== key;
                                                  }
                                                ),
                                            },
                                          };
                                        });
                                      } else {
                                        if (statusChecked) {
                                          setQuery((prev) => {
                                            return {
                                              ...prev,
                                              filter: {
                                                ...prev.filter,
                                                statusFilter:
                                                  prev.filter.statusFilter.filter(
                                                    (id) => {
                                                      return id !== key;
                                                    }
                                                  ),
                                              },
                                            };
                                          });
                                        } else {
                                          setQuery((prev) => {
                                            return {
                                              ...prev,
                                              filter: {
                                                ...prev.filter,
                                                statusFilter:
                                                  prev.filter.statusFilter
                                                    .length === 7
                                                    ? []
                                                    : [
                                                        ...prev.filter
                                                          .statusFilter,
                                                        key,
                                                      ],
                                              },
                                            };
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    <Chip
                                      className="capitalize"
                                      color={
                                        noFilter || statusChecked
                                          ? getApplicantStatusColor(key)
                                          : "default"
                                      }
                                      size="sm"
                                      variant={
                                        noFilter || statusChecked
                                          ? "solid"
                                          : "bordered"
                                      }
                                    >
                                      {key === "newApply" ? "New" : key}
                                    </Chip>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex flex-row gap-2 justify-center">
                              {(
                                [
                                  "shortlisted",
                                  "offer",
                                  "onboarding",
                                  "hired",
                                ] as const
                              ).map((key) => {
                                const noFilter =
                                  filter.statusFilter.length === 0;
                                const statusChecked =
                                  filter.statusFilter.includes(key);
                                return (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      if (noFilter) {
                                        setQuery((prev) => {
                                          return {
                                            ...prev,
                                            filter: {
                                              ...prev.filter,
                                              statusFilter:
                                                APPLICANT_STATUS_OPTIONS.filter(
                                                  (id) => {
                                                    return id !== key;
                                                  }
                                                ),
                                            },
                                          };
                                        });
                                      } else {
                                        if (statusChecked) {
                                          setQuery((prev) => {
                                            return {
                                              ...prev,
                                              filter: {
                                                ...prev.filter,
                                                statusFilter:
                                                  prev.filter.statusFilter.filter(
                                                    (id) => {
                                                      return id !== key;
                                                    }
                                                  ),
                                              },
                                            };
                                          });
                                        } else {
                                          setQuery((prev) => {
                                            return {
                                              ...prev,
                                              filter: {
                                                ...prev.filter,
                                                statusFilter:
                                                  prev.filter.statusFilter
                                                    .length === 7
                                                    ? []
                                                    : [
                                                        ...prev.filter
                                                          .statusFilter,
                                                        key,
                                                      ],
                                              },
                                            };
                                          });
                                        }
                                      }
                                    }}
                                  >
                                    <Chip
                                      className="capitalize"
                                      color={
                                        noFilter || statusChecked
                                          ? getApplicantStatusColor(key)
                                          : "default"
                                      }
                                      size="sm"
                                      variant={
                                        noFilter || statusChecked
                                          ? "solid"
                                          : "bordered"
                                      }
                                    >
                                      {key}
                                    </Chip>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </AccordionItem>
                        <AccordionItem
                          key="3"
                          aria-label="Stars"
                          classNames={{
                            subtitle:
                              filter.starsFilter === -1 ? null : "text-warning",
                          }}
                          startContent={
                            <StarBorderOutlinedIcon className="text-warning" />
                          }
                          subtitle={
                            filter.starsFilter === -1
                              ? "Any"
                              : `${filter.starsFilter}+`
                          }
                          title="Stars"
                        >
                          <div className="flex flex-row gap-2 justify-center">
                            {[-1, 1, 2, 3, 4, 5].map((key) => {
                              const starsChecked = filter.starsFilter === key;
                              return (
                                <button
                                  key={key}
                                  onClick={() => {
                                    setQuery((prev) => {
                                      return {
                                        ...prev,
                                        filter: {
                                          ...prev.filter,
                                          starsFilter: key,
                                        },
                                      };
                                    });
                                  }}
                                >
                                  <Chip
                                    color={
                                      key === -1 || !starsChecked
                                        ? "default"
                                        : "warning"
                                    }
                                    size="sm"
                                    variant={
                                      starsChecked ? "solid" : "bordered"
                                    }
                                  >
                                    {key === -1 ? "No Filter" : `${key}+`}
                                  </Chip>
                                </button>
                              );
                            })}
                          </div>
                        </AccordionItem>
                        <AccordionItem
                          key="4"
                          aria-label="Experience"
                          classNames={{
                            subtitle:
                              filter.yoeFilter.min === -1 &&
                              filter.yoeFilter.max === -1
                                ? null
                                : "text-secondary",
                          }}
                          startContent={
                            <WorkHistoryOutlinedIcon className="text-secondary" />
                          }
                          subtitle={
                            filter.yoeFilter.min === -1 &&
                            filter.yoeFilter.max === -1
                              ? "Any"
                              : `${
                                  filter.yoeFilter.min === -1
                                    ? "Any"
                                    : filter.yoeFilter.min
                                } - ${
                                  filter.yoeFilter.max === -1
                                    ? "Any"
                                    : filter.yoeFilter.max
                                }`
                          }
                          title="Experience"
                        >
                          <div className="flex gap-4 justify-center">
                            <div className="flex gap-2 items-center justify-center">
                              <div>Minimum</div>
                              <Input
                                size="sm"
                                label="Years"
                                className="w-16"
                                type="number"
                                value={
                                  filter.yoeFilter.min === -1
                                    ? undefined
                                    : filter.yoeFilter.min.toString()
                                }
                                placeholder="Any"
                                onValueChange={(value) => {
                                  setQuery((prev) => {
                                    return {
                                      ...prev,
                                      filter: {
                                        ...prev.filter,
                                        yoeFilter: {
                                          ...prev.filter.yoeFilter,
                                          min:
                                            value === "" ? -1 : Number(value),
                                        },
                                      },
                                    };
                                  });
                                }}
                              />
                            </div>
                            <div className="flex gap-2 items-center justify-center">
                              <div>Maximum</div>
                              <Input
                                size="sm"
                                label="Years"
                                className="w-16"
                                type="number"
                                value={
                                  filter.yoeFilter.max === -1
                                    ? undefined
                                    : filter.yoeFilter.max.toString()
                                }
                                placeholder="Any"
                                onValueChange={(value) => {
                                  setQuery((prev) => {
                                    return {
                                      ...prev,
                                      filter: {
                                        ...prev.filter,
                                        yoeFilter: {
                                          ...prev.filter.yoeFilter,
                                          max:
                                            value === "" ? -1 : Number(value),
                                        },
                                      },
                                    };
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </AccordionItem>
                      </Accordion>
                    ) : (
                      <div className="flex flex-col gap-3 w-[25vw] bg-content1 shadow-medium rounded-medium p-4">
                        <div className="flex justify-between items-center whitespace-nowrap">
                          <div className="w-full text-2xl font-bold">
                            {searchSettings.flash ? "Flash" : "Deep"} Mode
                          </div>
                          <Switch
                            size="lg"
                            color="primary"
                            isSelected={searchSettings.flash}
                            thumbIcon={({ isSelected, className }) =>
                              isSelected ? (
                                <BoltIcon className={className} />
                              ) : (
                                <SearchOutlinedIcon className={className} />
                              )
                            }
                            onValueChange={async (value) => {
                              await fetch(
                                "/api/settings/save-search-settings",
                                {
                                  method: "POST",
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                  body: JSON.stringify(searchSettings),
                                }
                              );
                              setSearchSettings((prev) => {
                                return { ...prev, flash: value };
                              });
                            }}
                          ></Switch>
                        </div>
                        <Divider />
                        <div
                          className={
                            searchSettings.flash
                              ? "text-lg text-primary-600"
                              : "text-lg text-warning-500"
                          }
                        >
                          {searchSettings.flash
                            ? "Flash mode is faster and cheaper, but provides less accurate results."
                            : "Deep mode takes longer and is more costly, but provides more accurate results."}
                        </div>
                        <Divider />
                        <div className="flex flex-row gap-3 items-center">
                          <Input
                            size="sm"
                            type="number"
                            label={
                              searchSettings.flash ? "flashTopK" : "deepTopK"
                            }
                            placeholder="10"
                            value={
                              searchSettings.flash
                                ? searchSettings.flashTopK.toString()
                                : searchSettings.deepTopK.toString()
                            }
                            onValueChange={(value) =>
                              setSearchSettings((prev) => {
                                return searchSettings.flash
                                  ? { ...prev, flashTopK: Number(value) }
                                  : { ...prev, deepTopK: Number(value) };
                              })
                            }
                          />
                          {searchSettings.flash ? null : (
                            <div className="text-lg text-warning-500">
                              {`Estimated cost is ${
                                searchSettings.deepTopK * 0.0015
                              }\$ per query.`}
                            </div>
                          )}
                        </div>
                        {searchSettings.flash ? null : <Divider />}
                        {searchSettings.flash ? null : (
                          <Slider
                            label="Deep Mode Weights"
                            step={0.01}
                            value={searchSettings.deepWeight}
                            onChangeEnd={(value) =>
                              setSearchSettings((prev) => {
                                return { ...prev, deepWeight: Number(value) };
                              })
                            }
                            maxValue={1}
                            minValue={0}
                            defaultValue={0.5}
                            className="max-w-md"
                            color="warning"
                            startContent="Similarity"
                            endContent="Questions"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
      <div
        className={
          tags.length === 0 &&
          filter.countryCodeFilter.length === 0 &&
          filter.statusFilter.length === 0 &&
          filter.starsFilter === -1 &&
          filter.yoeFilter.min === -1 &&
          filter.yoeFilter.max === -1
            ? "flex flex-wrap flex-initial gap-y-1"
            : "flex flex-wrap flex-initial gap-y-1 pt-unit-2"
        }
      >
        {tags.map((tag, index) => {
          const tagID = uuidv4();
          return (
            <div key={tagID} className="px-1">
              <Chip
                color="secondary"
                size="sm"
                variant="dot"
                onClose={() => {
                  setQuery((prev) => {
                    const newTags = [...prev.tags];
                    newTags.splice(index, 1);
                    return { ...prev, tags: newTags };
                  });
                }}
              >
                {tag}
              </Chip>
            </div>
          );
        })}
        {filter.countryCodeFilter.map((countryCode) => {
          const filterTagID = uuidv4();
          return (
            <div key={filterTagID} className="px-1">
              <Chip
                color="danger"
                size="sm"
                variant="dot"
                onClose={() => {
                  setQuery((prev) => {
                    return {
                      ...prev,
                      filter: {
                        ...prev.filter,
                        countryCodeFilter: prev.filter.countryCodeFilter.filter(
                          (id) => {
                            return id !== countryCode;
                          }
                        ),
                      },
                    };
                  });
                }}
              >
                {countryCode ? LOCATION_LOOKUP[countryCode] : "Unknown"}
              </Chip>
            </div>
          );
        })}
        {filter.statusFilter.map((status) => {
          const filterTagID = uuidv4();
          return (
            <div key={filterTagID} className="px-1">
              <Chip
                className="capitalize"
                color="danger"
                size="sm"
                variant="dot"
                onClose={() => {
                  setQuery((prev) => {
                    return {
                      ...prev,
                      filter: {
                        ...prev.filter,
                        statusFilter: prev.filter.statusFilter.filter((id) => {
                          return id !== status;
                        }),
                      },
                    };
                  });
                }}
              >
                {status === "newApply" ? "New" : status}
              </Chip>
            </div>
          );
        })}
        {filter.starsFilter !== -1 && (
          <div className="px-1">
            <Chip
              color="danger"
              size="sm"
              variant="dot"
              onClose={() => {
                setQuery((prev) => {
                  return {
                    ...prev,
                    filter: { ...prev.filter, starsFilter: -1 },
                  };
                });
              }}
            >
              {`${filter.starsFilter}+`}
            </Chip>
          </div>
        )}
        {(filter.yoeFilter.min !== -1 || filter.yoeFilter.max !== -1) && (
          <div className="px-1">
            <Chip
              color="danger"
              size="sm"
              variant="dot"
              onClose={() => {
                setQuery((prev) => {
                  return {
                    ...prev,
                    filter: { ...prev.filter, yoeFilter: { min: -1, max: -1 } },
                  };
                });
              }}
            >
              {filter.yoeFilter.min === -1
                ? `YOE <= ${filter.yoeFilter.max}`
                : filter.yoeFilter.max === -1
                ? `YOE >= ${filter.yoeFilter.min}`
                : `${filter.yoeFilter.min} <= YOE <= ${filter.yoeFilter.max}`}
            </Chip>
          </div>
        )}
      </div>
    </div>
  );
}
