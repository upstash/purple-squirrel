'use client'

import React from 'react';
import ApplicantsTable from "./ApplicantsTable";
import ApplicantCard from "./ApplicantCard";
import QueryBar from "./QueryBar";

export default function QueryTerminal({
  applicants,
  setApplicants,
  tableLoading,
  setTableLoading,
  queryBarLoading,
  setQueryBarLoading,
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
  recentQueriesState,
  setRecentQueriesState,
  savedQueriesState,
  setSavedQueriesState,
  settingsModalOpen,
  setSettingsModalOpen,
  selectedKeys,
  setSelectedKeys,
  visibleColumns,
  setVisibleColumns,
  rowsPerPage,
  setRowsPerPage,
  sortDescriptor,
  setSortDescriptor,
  tablePage,
  setTablePage,
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
    return (
      <div className="flex flex-col h-full">
        <div className="flex-initial pb-unit-2">
          <QueryBar 
                setApplicants={setApplicants}
                tableLoading={tableLoading}
                setTableLoading={setTableLoading}
                queryBarLoading={queryBarLoading}
                filter={filter}
                setFilter={setFilter}
                searchSettings={searchSettings}
                setSearchSettings={setSearchSettings}
                tags={tags}
                setTags={setTags}
                tagText={tagText}
                setTagText={setTagText}
                cardState={cardState}
                setCardState={setCardState}
                setRecentQueriesState={setRecentQueriesState}
                setSavedQueriesState={setSavedQueriesState}
                settingsModalOpen={settingsModalOpen}
                setSettingsModalOpen={setSettingsModalOpen}
                tablePage={tablePage}
                setTablePage={setTablePage}
                positions={positions}
                positionSearchText={positionSearchText}
                setPositionSearchText={setPositionSearchText}
                filterModalOpen={filterModalOpen}
                setFilterModalOpen={setFilterModalOpen}
                locationSearchText={locationSearchText}
                setLocationSearchText={setLocationSearchText}
                settingsTab={settingsTab}
                setSettingsTab={setSettingsTab}
          />
        </div>
        <div className="flex-auto flex h-full">
          <div className="flex-[72_1_0%] pt-unit-2 transition-all duration-300 ease-in-out">
            <div className="flex flex-col bg-default-50 rounded-medium h-full">
              <ApplicantsTable
                applicants={applicants}
                setApplicants={setApplicants}
                tableLoading={tableLoading}
                setTableLoading={setTableLoading}
                cardState={cardState}
                setCardState={setCardState}
                selectedKeys={selectedKeys}
                setSelectedKeys={setSelectedKeys}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                sortDescriptor={sortDescriptor}
                setSortDescriptor={setSortDescriptor}
                tablePage={tablePage}
                setTablePage={setTablePage}
              />
            </div>
          </div>
          {cardState.display
          ?
          <div className="flex-[28_1_0%] max-w-[400px] pl-unit-4 pt-unit-2 transition-all duration-300 ease-in-out">
            <div className="bg-default-50 rounded-medium w-full sticky pt-unit-1 pb-unit-2 px-unit-2 top-unit-4 z-50">
              <ApplicantCard
                setApplicants={setApplicants}
                cardState={cardState}
                setCardState={setCardState}
              />
            </div>
          </div>
          : null
          }
        </div>
      </div>
    )
  }
