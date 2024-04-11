'use client'

import React, { useState, useEffect } from 'react';
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/button";
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";
import {Slider} from "@nextui-org/slider";
import {Tooltip} from "@nextui-org/tooltip";
import SearchIcon from '@mui/icons-material/Search';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';
import ApplicantsTable from "./ApplicantsTable";
import ApplicantCard from "./ApplicantCard";
import {Switch} from "@nextui-org/switch";
import { Divider, card } from "@nextui-org/react";
import {Skeleton} from "@nextui-org/skeleton";
import { v4 as uuidv4 } from 'uuid';

export default function QueryTerminal({
    applicantIDs,
    setApplicantIDs,
    filteredApplicantIDs,
    setFilteredApplicantIDs,
    tableInfo,
    setTableInfo,
    isLoading,
    setIsLoading,
    isInitialLoading,
    searchSettings,
    setSearchSettings,
    loadingColor,
    setLoadingColor,
    loadingText,
    setLoadingText,
    queryText,
    setQueryText,
    emptyContent,
    setEmptyContent,
    displayCard,
    setDisplayCard,
    cardID,
    setCardID,
    cardScore,
    setCardScore,
    searchSystem,
    setSearchSystem,
    TopK,
    setTopK,
    initialMultiplier,
    setInitialMultiplier,
    regularMultiplier,
    setRegularMultiplier,
    weightedAverage,
    setWeightedAverage,
    mainWeight,
    setMainWeight,
    educationWeight,
    setEducationWeight,
    experienceWeight,
    setExperienceWeight,
    projectsWeight,
    setProjectsWeight,
    recentQueries,
    setRecentQueries,
    savedQueries,
    setSavedQueries,
    settingsModalOpen,
    setSettingsModalOpen,
    filterValue,
    setFilterValue,
    selectedKeys,
    setSelectedKeys,
    visibleColumns,
    setVisibleColumns,
    statusFilter,
    setStatusFilter,
    teamFilter,
    setTeamFilter,
    starsFilter,
    setStarsFilter,
    rowsPerPage,
    setRowsPerPage,
    sortDescriptor,
    setSortDescriptor,
    tablePage,
    setTablePage,
  }) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-initial pb-unit-2">
          <div className="bg-default-50 flex items-center rounded-medium px-unit-2 py-unit-3 h-full">
            {
              isInitialLoading
              ?
                <Skeleton className="flex-auto mx-unit-1 h-unit-10 rounded-medium"></Skeleton>
              :
                <div className="flex-auto px-unit-1">
                  <Input label={null} size="sm" radius="md" placeholder="Enter a query..." classNames={{inputWrapper: "h-unit-10"}} value={queryText} onValueChange={(value) => setQueryText(value)}/>
                </div>
            }
            {
              !isInitialLoading && searchSystem === "basic"
              ?
                <div className="flex-initial px-unit-1">
                  <Button
                    color="success"
                    size="md"
                    startContent={<SearchIcon />}
                    onPress={async () => {
                      if (queryText === "" || isLoading) {
                        return;
                      }
                      setEmptyContent(" ");
                      setLoadingColor("success");
                      setLoadingText("Searching...");
                      setIsLoading(true);
                      try {
                        const data = {
                          queryText: queryText,
                          searchSettings: searchSettings,
                          previousApplicants: filteredApplicantIDs,
                        }
                        const queryID = uuidv4();
                        setRecentQueries([{id: queryID, query: queryText}, ...recentQueries]);
                        const [searchResponse, redisResponse] = await Promise.all([fetch("/api/search", {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json"
                          },
                          body: JSON.stringify(data)
                        }), fetch("/api/push-recent-query", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({id: queryID, query: queryText})
                        })]);
                        const searchResponseData = await searchResponse.json();
                        if (searchResponseData.status === 200) {
                          if (applicantIDs.length === 0) {
                            const getInfoResponse = await fetch("/api/get-info", {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json"
                              },
                              body: JSON.stringify({ids: searchResponseData.filteredTopApplicants})
                            })
                            const getInfoResponseData = await getInfoResponse.json();
                            if (getInfoResponseData.status === 200) {
                              setApplicantIDs(searchResponseData.filteredTopApplicants);
                              const displayPairArray = searchResponseData.filteredTopApplicants.filter((pair) => pair.id === cardID);
                              if (displayPairArray.length > 0) {
                                setCardScore(Math.round(displayPairArray[0].score * 100));
                                setDisplayCard(true);
                              } else {
                                setDisplayCard(false);
                              }
                              setTableInfo(getInfoResponseData.tableInfo);
                              setQueryText("");
                              setIsLoading(false);
                            } else if (getInfoResponseData.status === 500) {
                              console.error(getInfoResponseData.message);
                            } else {
                              console.error("Unknown error");
                            }
                          } else {
                            setApplicantIDs(searchResponseData.filteredTopApplicants);
                            const displayPairArray = searchResponseData.filteredTopApplicants.filter((pair) => pair.id === cardID);
                            if (displayPairArray.length > 0) {
                                setCardScore(Math.round(displayPairArray[0].score * 100));
                                setDisplayCard(true);
                            } else {
                                setDisplayCard(false);
                            }
                            setTableInfo(searchResponseData.filteredTopApplicants.reduce((acc, val) => {
                              acc[val.id] = tableInfo[val.id];
                              return acc;
                            }, {}));
                            setQueryText("");
                            setIsLoading(false);
                          }
                        } else if (searchResponseData.status === 500) {
                          console.error(searchResponseData.message);
                        } else {
                          console.error("Unknown error");
                        }
                        setIsLoading(false);
                        setEmptyContent("No applicants found");
                      } catch (error) {
                        console.error(error);
                        setIsLoading(false);
                        setEmptyContent("No applicants found");
                      }
                    }}
                  >
                    Search
                  </Button>
                </div>
              :
                null
            }
            {
              isInitialLoading
              ?
                <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-10 rounded-medium"></Skeleton>
              :
                (
                  searchSystem === "advanced"
                  ?
                    <div className="flex-initial px-unit-1">
                      <Tooltip content="Flash-Rank" color={"primary"} delay={400} closeDelay={600}>
                        <Button
                          isIconOnly
                          color="primary"
                          size="md"
                          onPress={async () => {
                            if (queryText === "" || isLoading) {
                              return;
                            }
                            setEmptyContent(" ");
                            setIsLoading(true);
                            setLoadingColor("primary");
                            setLoadingText("Ranking Applicants...");
                            try {
                              const data = {
                                queryText: queryText,
                                searchSettings: searchSettings,
                                previousApplicants: filteredApplicantIDs,
                              }
                              const queryID = uuidv4();
                              setRecentQueries([{id: queryID, query: queryText}, ...recentQueries]);
                              const [flashRankResponse, redisResponse] = await Promise.all([fetch("/api/flash-rank", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(data)
                              }), fetch("/api/push-recent-query", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({id: queryID, query: queryText})
                              })]);
                              const flashRankResponseData = await flashRankResponse.json();
                              if (flashRankResponseData.status === 200) {
                                if (applicantIDs.length === 0) {
                                  const getInfoResponse = await fetch("/api/get-info", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ids: flashRankResponseData.topApplicants})
                                  })
                                  const getInfoResponseData = await getInfoResponse.json();
                                  if (getInfoResponseData.status === 200) {
                                    setApplicantIDs(flashRankResponseData.topApplicants);
                                    const displayPairArray = flashRankResponseData.topApplicants.filter((pair) => pair.id === cardID);
                                    if (displayPairArray.length > 0) {
                                      setCardScore(Math.round(displayPairArray[0].score * 100));
                                      setDisplayCard(true);
                                    } else {
                                      setDisplayCard(false);
                                    }
                                    setTableInfo(getInfoResponseData.tableInfo);
                                    setQueryText("");
                                    setIsLoading(false);
                                  } else if (getInfoResponseData.status === 500) {
                                    console.error(getInfoResponseData.message);
                                  } else {
                                    console.error("Unknown error");
                                  }
                                } else {
                                  setApplicantIDs(flashRankResponseData.topApplicants);
                                  const displayPairArray = flashRankResponseData.topApplicants.filter((pair) => pair.id === cardID);
                                    if (displayPairArray.length > 0) {
                                        setCardScore(Math.round(displayPairArray[0].score * 100));
                                        setDisplayCard(true);
                                    } else {
                                        setDisplayCard(false);
                                    }
                                  setTableInfo(flashRankResponseData.topApplicants.reduce((acc, val) => {
                                    acc[val.id] = tableInfo[val.id];
                                    return acc;
                                  }, {}));
                                  setQueryText("");
                                  setIsLoading(false);
                                }
                              } else if (flashRankResponseData.status === 500) {
                                console.error(flashRankResponseData.message);
                              } else {
                                console.error("Unknown error");
                              }
                              setIsLoading(false);
                              setEmptyContent("No applicants found");
                            } catch (error) {
                              console.error(error);
                              setIsLoading(false);
                              setEmptyContent("No applicants found");
                            }
                          }}

                        >
                          <BoltIcon />
                        </Button>
                      </Tooltip>
                    </div>
                  :
                    null
                )
            }
            {
              isInitialLoading
              ?
                <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-10 rounded-medium"></Skeleton>
              :
                (
                  searchSystem === "advanced"
                  ?
                    <div className="flex-initial px-unit-1">
                      <Tooltip content="Bump-Up" color="warning" delay={400} closeDelay={600}>
                        <Button
                          isIconOnly
                          color="warning"
                          size="md"
                        >
                          <KeyboardDoubleArrowUpOutlinedIcon />
                        </Button>
                      </Tooltip>
                    </div>
                  :
                    null
                )
            }
            {
              isInitialLoading
              ?
                <Skeleton className="flex-initial mx-unit-1 h-unit-10 w-unit-10 rounded-medium"></Skeleton>
              :
                (
                  searchSystem === "advanced"
                  ?
                    <div className="flex-initial px-unit-1">
                      <Tooltip content="Hand-Pick" color={"danger"} delay={400} closeDelay={600}>
                        <Button
                          isIconOnly
                          color="danger"
                          size="md"
                          onPress={async () => {
                            if (queryText === "" || isLoading) {
                              return;
                            }
                            setEmptyContent(" ");
                            setIsLoading(true);
                            setLoadingColor("danger");
                            setLoadingText("Filtering Applicants...");
                            try {
                              const data = {
                                queryText: queryText,
                                searchSettings: searchSettings,
                                previousApplicants: filteredApplicantIDs,
                              }
                              const queryID = uuidv4();
                              setRecentQueries([{id: queryID, query: queryText}, ...recentQueries]);
                              const [handPickResponse, redisResponse] = await Promise.all([fetch("/api/hand-pick", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(data)
                              }), fetch("/api/push-recent-query", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({id: queryID, query: queryText})
                            })]);
                              const handPickResponseData = await handPickResponse.json();
                              if (handPickResponseData.status === 200) {
                                if (applicantIDs.length === 0) {
                                  const getInfoResponse = await fetch("/api/get-info", {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({ids: handPickResponseData.filteredApplicants})
                                  })
                                  const getInfoResponseData = await getInfoResponse.json();
                                  if (getInfoResponseData.status === 200) {
                                    setApplicantIDs(handPickResponseData.filteredApplicants);
                                    const displayPairArray = handPickResponseData.filteredApplicants.filter((pair) => pair.id === cardID);
                                    if (displayPairArray.length > 0) {
                                      setCardScore(Math.round(displayPairArray[0].score * 100));
                                      setDisplayCard(true);
                                    } else {
                                      setDisplayCard(false);
                                    }
                                    setTableInfo(getInfoResponseData.tableInfo);
                                    setQueryText("");
                                    setIsLoading(false);
                                  } else if (getInfoResponseData.status === 500) {
                                    console.error(getInfoResponseData.message);
                                  } else {
                                    console.error("Unknown error");
                                  }
                                } else {
                                  setApplicantIDs(handPickResponseData.filteredApplicants);
                                  const displayPairArray = handPickResponseData.filteredApplicants.filter((pair) => pair.id === cardID);
                                    if (displayPairArray.length > 0) {
                                      setCardScore(Math.round(displayPairArray[0].score * 100));
                                      setDisplayCard(true);
                                    } else {
                                      setDisplayCard(false);
                                    }
                                  setTableInfo(handPickResponseData.filteredApplicants.reduce((acc, val) => {
                                    acc[val.id] = tableInfo[val.id];
                                    return acc;
                                  }, {}));
                                  setQueryText("");
                                  setIsLoading(false);
                                }
                              } else if (handPickResponseData.status === 500) {
                                console.error(handPickResponseData.message);
                              } else {
                                console.error("Unknown error");
                              }
                              setIsLoading(false);
                              setEmptyContent("No applicants found");
                            } catch (error) {
                              console.error(error);
                              setIsLoading(false);
                              setEmptyContent("No applicants found");
                            }
                          }}
                        >
                          <FilterAltOutlinedIcon />
                        </Button>
                      </Tooltip>
                    </div>
                  :
                    null
                )
            }
            <Divider className="flex-initial mx-unit-1" orientation="vertical" />
            <div className="flex-initial px-unit-1">
              <Tooltip content="Save Query" color={"secondary"} delay={400} closeDelay={600}>
                <Button isIconOnly color="secondary" size="md"
                    onPress={async () => {
                        console.log(applicantIDs)
                        console.log(tableInfo)
                        if (queryText === "" || isLoading) {
                            return;
                        }
                        const queryID = uuidv4();
                        setSavedQueries([{id: queryID, query: queryText}, ...savedQueries]);
                        await fetch("/api/save-query", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({id: queryID, query: queryText})
                        });
                    }}
                >
                    <BookmarkBorderIcon />
                </Button>
              </Tooltip>
            </div>
            <div className="flex-initial px-unit-1">
              <Popover placement="bottom" isOpen={settingsModalOpen} onOpenChange={(open) => setSettingsModalOpen(open)}>
                <PopoverTrigger>
                  <Button isIconOnly color="secondary" size="md">
                    <Tooltip content="Settings" color={"secondary"} delay={400} closeDelay={600}>
                      <SettingsOutlinedIcon />
                    </Tooltip>
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-2 py-2 w-[33vw]">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-auto w-full text-2xl font-bold">Settings</div>
                        <div className="flex-initial capitalize whitespace-nowrap">{`${searchSystem} Search`}</div>
                        <Switch defaultSelected className="flex-initial" color="danger" isSelected={searchSystem === "advanced"} size="md" onValueChange={(isSelected) => {isSelected ? setSearchSystem((prev) => "advanced") : setSearchSystem((prev) => "basic")}} ></Switch>
                      </div>
                      <Divider />
                      <div className= "flex gap-3">
                        <Input type="number" label="TopK" placeholder="10" value={TopK} onValueChange={(value) => setTopK(value)}/>
                        <Input type="number" label="Initial Multiplier" placeholder="2" value={initialMultiplier} onValueChange={(value) => setInitialMultiplier(value)}/>
                        <Input type="number" label="Regular Multiplier" placeholder="2" value={regularMultiplier} onValueChange={(value) => setRegularMultiplier(value)}/>
                      </div>
                      <Divider />
                      <Slider 
                        label="Weighted Average" 
                        step={0.01} 
                        value={weightedAverage}
                        onChangeEnd={(value) => setWeightedAverage(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.5}
                        className="max-w-md"
                        color="foreground"
                        startContent="Old"
                        endContent="New"
                      />
                      <Divider />
                      <Slider 
                        label="Main Weight" 
                        step={0.01} 
                        value={mainWeight}
                        onChangeEnd={(value) => setMainWeight(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.9}
                        className="max-w-md"
                        color="primary"
                      />
                      <Slider 
                        label="Education Weight" 
                        step={0.01} 
                        value={educationWeight}
                        onChangeEnd={(value) => setEducationWeight(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.4}
                        className="max-w-md"
                        color="success"
                      />
                      <Slider 
                        label="Experience Weight" 
                        step={0.01} 
                        value={experienceWeight}
                        onChangeEnd={(value) => setExperienceWeight(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.7}
                        className="max-w-md"
                        color="secondary"
                      />
                      <Slider 
                        label="Projects Weight" 
                        step={0.01} 
                        value={projectsWeight}
                        onChangeEnd={(value) => setProjectsWeight(value)}
                        maxValue={1} 
                        minValue={0} 
                        defaultValue={0.1}
                        className="max-w-md"
                        color="warning"
                      />
                      <Divider />
                      <div className="flex gap-3">
                        <div className="flex-auto">
                          
                        </div>
                        <Tooltip content="Reset to last saved settings" color={"danger"} delay={400} closeDelay={600}>
                          <Button
                            className="flex-initial"
                            color="danger"
                            variant="light"
                            onPress={() => {
                              setTopK(searchSettings.topK);
                              setInitialMultiplier(searchSettings.multipliers.firstTopKMultiplier);
                              setRegularMultiplier(searchSettings.multipliers.regularTopKMultiplier);
                              setWeightedAverage(searchSettings.weights.newWeight);
                              setMainWeight(searchSettings.weights.mainWeight);
                              setEducationWeight(searchSettings.weights.educationWeight);
                              setExperienceWeight(searchSettings.weights.experienceWeight);
                              setProjectsWeight(searchSettings.weights.projectsWeight);
                            }}
                          >
                            Reset
                          </Button>
                        </Tooltip>
                        <Tooltip content="Save settings" color={"secondary"} delay={400} closeDelay={600}>
                          <Button
                            className="flex-initial"
                            color="secondary"
                            onPress={async () => {
                              const tempSearchSettings = {
                                topK: TopK,
                                searchSystem: searchSystem,
                                multipliers: {
                                  firstTopKMultiplier: initialMultiplier,
                                  regularTopKMultiplier: regularMultiplier
                                },
                                weights: {
                                  mainWeight: mainWeight,
                                  educationWeight: educationWeight,
                                  experienceWeight: experienceWeight,
                                  projectsWeight: projectsWeight,
                                  oldWeight: 1 - weightedAverage,
                                  newWeight: weightedAverage
                                }
                              }
                              setSearchSettings(tempSearchSettings);
                              await fetch("/api/save-search-settings", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json"
                                },
                                body: JSON.stringify(tempSearchSettings)
                              });
                              setSettingsModalOpen(false);
                            }}
                          >
                            Save
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="flex-auto flex h-full">
          <div className="flex-[72_1_0%] pr-unit-2 pt-unit-2">
            <div className="flex flex-col bg-default-50 rounded-medium h-full p-unit-3">
              <ApplicantsTable applicantIDs={applicantIDs} setApplicantIDs={setApplicantIDs} setFilteredApplicantIDs={setFilteredApplicantIDs} tableInfo={tableInfo} setTableInfo={setTableInfo} loadingColor={loadingColor} setLoadingColor={setLoadingColor} loadingText={loadingText} setLoadingText={setLoadingText} isLoading={isLoading} setIsLoading={setIsLoading} emptyContent={emptyContent} cardID={cardID} setCardID={setCardID} setDisplayCard={setDisplayCard} setCardScore={setCardScore}
                filterValue={filterValue}
                setFilterValue={setFilterValue}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                teamFilter={teamFilter}
                setTeamFilter={setTeamFilter}
                starsFilter={starsFilter}
                setStarsFilter={setStarsFilter}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                sortDescriptor={sortDescriptor}
                setSortDescriptor={setSortDescriptor}
                tablePage={tablePage}
                setTablePage={setTablePage}
              />
            </div>
          </div>
          <div className="flex-[28_1_0%] pl-unit-2 pt-unit-2">
            <div className="bg-default-50 rounded-medium h-full p-unit-3">
              <ApplicantCard displayCard={displayCard} setDisplayCard={setDisplayCard} cardID={cardID} tableInfo={tableInfo} setTableInfo={setTableInfo} cardScore={cardScore} setApplicantIDs={setApplicantIDs} />
            </div>
          </div>
        </div>
      </div>
    )
  }
