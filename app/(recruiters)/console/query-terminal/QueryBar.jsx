"use client";

import React from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Slider } from "@nextui-org/slider";
import { Tooltip } from "@nextui-org/tooltip";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { Divider } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/skeleton";
import { v4 as uuidv4 } from "uuid";
import { Chip } from "@nextui-org/chip";
import { Switch } from "@nextui-org/switch";
import { ChevronDownIcon } from "@/app/utils/ChevronDownIcon";
import { ScrollShadow } from "@nextui-org/scroll-shadow";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Tabs, Tab } from "@nextui-org/tabs";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import NextWeekOutlinedIcon from "@mui/icons-material/NextWeekOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import WorkHistoryOutlinedIcon from "@mui/icons-material/WorkHistoryOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import filterCoder from "@/app/utils/filterCoder";

import { locations, locationLookup } from "@/app/utils/locations";
import { capitalize } from "@/app/utils/utils";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";

import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";

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

const statusColorMap = {
  newApply: "default",
  screening: "warning",
  assessment: "warning",
  interview: "warning",
  shortlisted: "danger",
  offer: "secondary",
  onboarding: "success",
  hired: "success",
};


const statusArray = Object.keys(statusColorMap);

const starsOptions = [
  { name: "No Filter", uid: "No Filter" },
  { name: "1+", uid: "1" },
  { name: "2+", uid: "2" },
  { name: "3+", uid: "3" },
  { name: "4+", uid: "4" },
  { name: "5+", uid: "5" },
];

const starsSet = new Set(["No Filter"]);

const eqSet = (xs, ys) =>
  xs.size === ys.size && [...xs].every((x) => ys.has(x));

const inSet = (xs, ys) => [...xs].every((x) => ys.has(x));

function getTabColor(tab) {
  if (tab === "filters") {
    return "warning";
  } else {
    return "secondary";
  }
}

export default function QueryBar({
    setApplicants,
    tableLoading,
    setTableLoading,
    queryBarLoading,
    filter,
    setFilter,
    searchSettings,
    setSearchSettings,
    tags,
    setTags,
    tagText,
    setTagText,
    cardState,
    setCardState,
    setRecentQueriesState,
    setSavedQueriesState,
    settingsModalOpen,
    setSettingsModalOpen,
    positions,
    positionSearchText,
    setPositionSearchText,
    filterModalOpen,
    setFilterModalOpen,
    locationSearchText,
    setLocationSearchText,
    settingsTab,
    setSettingsTab,
}) {
  const itemClasses = {
    base: "py-0 w-full",
    title: "font-normal text-medium",
    trigger:
      "px-2 py-0 data-[hover=true]:bg-default-100 rounded-lg h-14 flex items-center",
    indicator: "text-medium",
    content: "text-small px-2",
  };

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
                  setTags((prev) => [...prev, tagText]);
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
              selectedKey={filter.positionFilter?.id}
              onSelectionChange={(key) => {
                setFilter((prev) => {
                  const title = positions.filter((position) => position.id == key)[0].name;
                  return { ...prev, positionFilter: {id: key, title: title} };
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
              isDisabled={tableLoading.status || tags.length === 0 || !filter.positionFilter || !filter.positionFilter.id}
              onPress={async () => {
                if (tableLoading.status) {
                  return;
                }
                if (tags.length === 0) {
                  return;
                }
                if (!filter.positionFilter || !filter.positionFilter.id) {
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
                    positionId: filter.positionFilter.id,
                    positionTitle: filter.positionFilter.title,
                    filter: filterCoder(filter),
                    searchSettings: searchSettings,
                    rankType: searchSettings.flash ? "flash" : "deep",
                  };
                  const queryID = uuidv4();
                  setRecentQueriesState((prev) => {
                    return {
                      ...prev,
                      recentQueries: [
                        { id: queryID, query: tags, filter: filter },
                        ...prev.recentQueries,
                      ],
                    };
                  });
                  const [rankResponse, redisResponse] = await Promise.all([
                    fetch(
                      searchSettings.flash
                        ? "/api/query/flash-rank"
                        : "/api/query/deep-rank",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(data),
                      }
                    ),
                    fetch("/api/query/push-recent-query", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        id: queryID,
                        query: tags,
                        filter: filter,
                      }),
                    }),
                  ]);
                  const rankResponseData = await rankResponse.json();
                  console.log(rankResponseData);
                  if (rankResponseData.status === 200) {
                    const rankApplicants = searchSettings.flash
                      ? rankResponseData.flashRankedApplicants
                      : rankResponseData.deepRankedApplicants;
                    setApplicants(rankApplicants);
                    const displayTripletArray = rankApplicants.filter(
                      (triplet) => triplet.id === cardState.id
                    );
                    if (displayTripletArray.length > 0) {
                      setCardState((prev) => {
                        return { ...prev, score: displayTripletArray[0].score };
                      });
                    } else {
                      if (cardState.doc && cardState.doc.notes) {
                        await fetch(`/api/console/set-applicant-notes`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            id: cardState.id,
                            notes: cardState.doc.notes,
                          }),
                        });
                      }
                      setCardState((prev) => {
                        return { ...prev, display: false };
                      });
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
        {/*
                        queryBarLoading
                        ?
                            <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-10 rounded-medium"></Skeleton>
                        :
                            (
                                <div className="flex-initial px-unit-1">
                                    <Button isIconOnly color="primary" size="md" variant="solid"
                                        onPress={async () => {
                                            if (tags.length === 0 || tableLoading.status) {
                                                return;
                                            }
                                            const queryID = uuidv4();
                                            setSavedQueriesState((prev) => {return {...prev, savedQueries: [{id: queryID, query: tags, filter: filter}, ...prev.savedQueries]};});
                                            await fetch("/api/query/save-query", {
                                                method: "POST",
                                                headers: {
                                                    "Content-Type": "application/json"
                                                },
                                                body: JSON.stringify({id: queryID, query: tags, filter: filter})
                                            });
                                        }}
                                    >
                                        <Tooltip content="Save Query" color="primary" delay={400} closeDelay={600}>
                                            <BookmarkBorderIcon />
                                        </Tooltip>
                                    </Button>
                                </div>
                            )
                        */}
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
                        setSettingsTab(key);
                      }}
                    >
                      <Tab key="filters" title="Filters" />
                      <Tab key="ranking" title="Ranking" />
                    </Tabs>
                    {settingsTab === "filters" ? (
                      <Accordion
                        showDivider={false}
                        className="p-2 flex flex-col gap-1 w-full w-[25vw]"
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
                                              setFilter((prev) => {
                                                return {
                                                  ...prev,
                                                  countryCodeFilter:
                                                    prev.countryCodeFilter.filter(
                                                      (id) => {
                                                        return (
                                                          id !== countryCode
                                                        );
                                                      }
                                                    ),
                                                };
                                              });
                                            }}
                                          >
                                            <div className="flex justify-between w-full text-sm text-left">
                                              {locationLookup[countryCode]}
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
                                  {locations
                                    .filter((location) => {
                                      return location.name
                                        .toLowerCase()
                                        .includes(
                                          locationSearchText.toLowerCase()
                                        );
                                    })
                                    .map((location) => {
                                      const checked =
                                        filter.countryCodeFilter.includes(
                                          location.iso2
                                        );
                                      return (
                                        <Button
                                          size="sm"
                                          key={location.iso2}
                                          variant="light"
                                          color={
                                            checked ? "primary" : "default"
                                          }
                                          onPress={() => {
                                            if (checked) {
                                              setFilter((prev) => {
                                                return {
                                                  ...prev,
                                                  countryCodeFilter:
                                                    prev.countryCodeFilter.filter(
                                                      (id) => {
                                                        return (
                                                          id !== location.iso2
                                                        );
                                                      }
                                                    ),
                                                };
                                              });
                                            } else {
                                              setFilter((prev) => {
                                                return {
                                                  ...prev,
                                                  countryCodeFilter: [
                                                    ...prev.countryCodeFilter,
                                                    location.iso2,
                                                  ],
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
                              {[
                                "newApply",
                                "screening",
                                "assessment",
                                "interview",
                              ].map((key) => {
                                const noFilter =
                                  filter.statusFilter.length === 0;
                                const statusChecked =
                                  filter.statusFilter.includes(key);
                                return (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      if (noFilter) {
                                        setFilter((prev) => {
                                          return {
                                            ...prev,
                                            statusFilter: statusArray.filter(
                                              (id) => {
                                                return id !== key;
                                              }
                                            ),
                                          };
                                        });
                                      } else {
                                        if (statusChecked) {
                                          setFilter((prev) => {
                                            return {
                                              ...prev,
                                              statusFilter:
                                                prev.statusFilter.filter(
                                                  (id) => {
                                                    return id !== key;
                                                  }
                                                ),
                                            };
                                          });
                                        } else {
                                          setFilter((prev) => {
                                            return {
                                              ...prev,
                                              statusFilter:
                                                prev.statusFilter.length === 7
                                                  ? []
                                                  : [...prev.statusFilter, key],
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
                                          ? statusColorMap[key]
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
                              {[
                                "shortlisted",
                                "offer",
                                "onboarding",
                                "hired",
                              ].map((key) => {
                                const noFilter =
                                  filter.statusFilter.length === 0;
                                const statusChecked =
                                  filter.statusFilter.includes(key);
                                return (
                                  <button
                                    key={key}
                                    onClick={() => {
                                      if (noFilter) {
                                        setFilter((prev) => {
                                          return {
                                            ...prev,
                                            statusFilter: statusArray.filter(
                                              (id) => {
                                                return id !== key;
                                              }
                                            ),
                                          };
                                        });
                                      } else {
                                        if (statusChecked) {
                                          setFilter((prev) => {
                                            return {
                                              ...prev,
                                              statusFilter:
                                                prev.statusFilter.filter(
                                                  (id) => {
                                                    return id !== key;
                                                  }
                                                ),
                                            };
                                          });
                                        } else {
                                          setFilter((prev) => {
                                            return {
                                              ...prev,
                                              statusFilter:
                                                prev.statusFilter.length === 7
                                                  ? []
                                                  : [...prev.statusFilter, key],
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
                                          ? statusColorMap[key]
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
                                    setFilter((prev) => {
                                      return { ...prev, starsFilter: key };
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
                                    ? null
                                    : filter.yoeFilter.min
                                }
                                placeholder="Any"
                                onValueChange={(value) => {
                                  setFilter((prev) => {
                                    return {
                                      ...prev,
                                      yoeFilter: {
                                        ...prev.yoeFilter,
                                        min: value === "" ? -1 : value,
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
                                    ? null
                                    : filter.yoeFilter.max
                                }
                                placeholder="Any"
                                onValueChange={(value) => {
                                  setFilter((prev) => {
                                    return {
                                      ...prev,
                                      yoeFilter: {
                                        ...prev.yoeFilter,
                                        max: value === "" ? -1 : value,
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
                              await fetch("/api/settings/save-search-settings", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(searchSettings),
                              });
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
                                ? searchSettings.flashTopK
                                : searchSettings.deepTopK
                            }
                            onValueChange={(value) =>
                              setSearchSettings((prev) => {
                                return searchSettings.flash
                                  ? { ...prev, flashTopK: value }
                                  : { ...prev, deepTopK: value };
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
                                return { ...prev, deepWeight: value };
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
                  setTags((prev) => {
                    const newTags = [...prev];
                    newTags.splice(index, 1);
                    return newTags;
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
                  setFilter((prev) => {
                    return {
                      ...prev,
                      countryCodeFilter: prev.countryCodeFilter.filter((id) => {
                        return id !== countryCode;
                      }),
                    };
                  });
                }}
              >
                {locationLookup[countryCode]}
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
                  setFilter((prev) => {
                    return {
                      ...prev,
                      statusFilter: prev.statusFilter.filter((id) => {
                        return id !== status;
                      }),
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
                setFilter((prev) => {
                  return { ...prev, starsFilter: -1 };
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
                setFilter((prev) => {
                  return { ...prev, yoeFilter: { min: -1, max: -1 } };
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
