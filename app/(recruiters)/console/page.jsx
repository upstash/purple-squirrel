'use client';

import React, { useState, useEffect } from 'react';
import {Tabs, Tab} from "@nextui-org/react";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import {SquirrelIcon} from '@primer/octicons-react'
import QueryTerminal from "./query-terminal/QueryTerminal";
import RecentQueries from "./recent-queries/RecentQueries";
import SavedQueries from "./saved-queries/SavedQueries";

export default function Page() {
    const [varColor, setVarColor] = useState("secondary")
    const [activeTab, setActiveTab] = useState("query-terminal");

    const [applicantIDs, setApplicantIDs] = useState([]);
    const [tableInfo, setTableInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchSettings, setSearchSettings] = useState(null);
    const [loadingColor, setLoadingColor] = useState("default");
    const [loadingText, setLoadingText] = useState("Loading Search Settings...");
    const [queryText, setQueryText] = useState("");
    const [emptyContent, setEmptyContent] = useState(" ");
    const [displayCard, setDisplayCard] = useState(false);
    const [cardID, setCardID] = useState(null);
    const [cardScore, setCardScore] = useState(null);
    const [TopK, setTopK] = useState(10);
    const [initialMultiplier, setInitialMultiplier] = useState(2);
    const [regularMultiplier, setRegularMultiplier] = useState(2);
    const [weightedAverage, setWeightedAverage] = useState(0.5);
    const [mainWeight, setMainWeight] = useState(0.9);
    const [educationWeight, setEducationWeight] = useState(0.4);
    const [experienceWeight, setExperienceWeight] = useState(0.7);
    const [projectsWeight, setProjectsWeight] = useState(0.1);

    const [recentQueries, setRecentQueries] = useState([]);
    const [savedQueries, setSavedQueries] = useState([]);
    const [emptyRecentQueries, setEmptyRecentQueries] = useState(" ");
    const [emptySavedQueries, setEmptySavedQueries] = useState(" ");
    const [loadingRecentQueries, setLoadingRecentQueries] = useState(true);
    const [loadingSavedQueries, setLoadingSavedQueries] = useState(true);

    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/get-search-settings')
          .then((res) => res.json())
          .then((data) => {
            setSearchSettings(data);
            setTopK(data.topK);
            setInitialMultiplier(data.multipliers.firstTopKMultiplier);
            setRegularMultiplier(data.multipliers.regularTopKMultiplier);
            setWeightedAverage(data.weights.newWeight);
            setMainWeight(data.weights.mainWeight);
            setEducationWeight(data.weights.educationWeight);
            setExperienceWeight(data.weights.experienceWeight);
            setProjectsWeight(data.weights.projectsWeight);
            setIsLoading(false);
            setEmptyContent("Enter a query to find applicants.");
          })
      }, [setEducationWeight, setEmptyContent, setExperienceWeight, setInitialMultiplier, setIsLoading, setMainWeight, setProjectsWeight, setRegularMultiplier, setSearchSettings, setTopK, setWeightedAverage]);

    useEffect(() => {
        fetch('/api/get-recent-queries')
          .then((res) => res.json())
          .then((data) => {
            setRecentQueries(data);
            setLoadingRecentQueries(false);
            setEmptyRecentQueries("No recent queries found.");
          })
      }, [setRecentQueries, setLoadingRecentQueries, setEmptyRecentQueries]);
    
    useEffect(() => {
        fetch('/api/get-saved-queries')
          .then((res) => res.json())
          .then((data) => {
            setSavedQueries(data);
            setLoadingSavedQueries(false);
            setEmptySavedQueries("No saved queries found.");
          })
      }, [setSavedQueries, setLoadingSavedQueries, setEmptySavedQueries]);
    
    return (
        <section className="flex flex-col box-border h-screen">
          <header className="flex-initial pt-unit-4 p-unit-4">
            <div className="flex items-center bg-default-50 py-unit-2 px-unit-1 rounded-xl">
              <div className="flex-1 flex items-center justify-start">
                <div className="text-secondary pl-unit-3 pr-unit-1">
                  <SquirrelIcon size={32} className="scale-x-[-1]" />
                </div>
                <h1 className="text-xl">Purple Squirrel</h1>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Tabs key={"primary"} color={varColor} aria-label="Tabs colors" selectedKey={activeTab} radius="full" onSelectionChange={(key) => {
                    setActiveTab(key);
                    (key === "query-terminal") ? setVarColor("secondary") : ((key === "recent-queries") ? setVarColor("warning") : setVarColor("primary"));
                }}>
                  <Tab key="query-terminal" title="Query Terminal"/>
                  <Tab key="recent-queries" title="Recent Queries"/>
                  <Tab key="saved-queries" title="Saved Queries"/>
                </Tabs>
              </div>
              <div className="flex-1 flex items-center justify-end">
                <ThemeSwitcher color={varColor} />
              </div>
            </div>
          </header>
          <div className="flex-auto px-unit-4 pb-unit-4">
            {(activeTab === "query-terminal") ? <QueryTerminal 
                                                    applicantIDs={applicantIDs}
                                                    setApplicantIDs={setApplicantIDs}
                                                    tableInfo={tableInfo}
                                                    setTableInfo={setTableInfo}
                                                    isLoading={isLoading}
                                                    setIsLoading={setIsLoading}
                                                    searchSettings={searchSettings}
                                                    setSearchSettings={setSearchSettings}
                                                    loadingColor={loadingColor}
                                                    setLoadingColor={setLoadingColor}
                                                    loadingText={loadingText}
                                                    setLoadingText={setLoadingText}
                                                    queryText={queryText}
                                                    setQueryText={setQueryText}
                                                    emptyContent={emptyContent}
                                                    setEmptyContent={setEmptyContent}
                                                    displayCard={displayCard}
                                                    setDisplayCard={setDisplayCard}
                                                    cardID={cardID}
                                                    setCardID={setCardID}
                                                    cardScore={cardScore}
                                                    setCardScore={setCardScore}
                                                    TopK={TopK}
                                                    setTopK={setTopK}
                                                    initialMultiplier={initialMultiplier}
                                                    setInitialMultiplier={setInitialMultiplier}
                                                    regularMultiplier={regularMultiplier}
                                                    setRegularMultiplier={setRegularMultiplier}
                                                    weightedAverage={weightedAverage}
                                                    setWeightedAverage={setWeightedAverage}
                                                    mainWeight={mainWeight}
                                                    setMainWeight={setMainWeight}
                                                    educationWeight={educationWeight}
                                                    setEducationWeight={setEducationWeight}
                                                    experienceWeight={experienceWeight}
                                                    setExperienceWeight={setExperienceWeight}
                                                    projectsWeight={projectsWeight}
                                                    setProjectsWeight={setProjectsWeight}
                                                    recentQueries={recentQueries}
                                                    setRecentQueries={setRecentQueries}
                                                    savedQueries={savedQueries}
                                                    setSavedQueries={setSavedQueries}
                                                    settingsModalOpen={settingsModalOpen}
                                                    setSettingsModalOpen={setSettingsModalOpen}
                                                />
            : ((activeTab === "recent-queries") ? <RecentQueries 
                                                    recentQueries={recentQueries}
                                                    setQueryText={setQueryText}
                                                    loadingRecentQueries={loadingRecentQueries}
                                                    setActiveTab={setActiveTab}
                                                    setVarColor={setVarColor}
                                                    savedQueries={savedQueries}
                                                    setSavedQueries={setSavedQueries}
                                                    emptyRecentQueries={emptyRecentQueries}
                                                />
            : <SavedQueries
                savedQueries={savedQueries}
                setSavedQueries={setSavedQueries}
                setQueryText={setQueryText}
                loadingSavedQueries={loadingSavedQueries}
                setActiveTab={setActiveTab}
                setVarColor={setVarColor}
                emptySavedQueries={emptySavedQueries}
            />)}
          </div>
        </section>
    )
  }