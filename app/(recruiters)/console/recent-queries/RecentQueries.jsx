"use client";

import React from "react";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {Tooltip} from "@nextui-org/tooltip";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {Spinner} from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";
import {Chip} from "@nextui-org/chip";
import { v4 as uuidv4 } from 'uuid';
import { locations, locationLookup } from "@/app/utils/locations";

const columns = [
    {name: "QUERY", uid: "query"},
    {name: "ACTIONS", uid: "actions"},
  ];

export default function RecentQueries({
    recentQueriesState,
    setRecentQueriesState,
    setSavedQueriesState,
    setTags,
    setFilter,
    setActiveTab,
}) {
  
  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "query":
        return (
            <div className="flex flex-wrap flex-initial gap-y-2 px-1">
                { item.filter.positionFilter?.id && item.filter.positionFilter?.title &&
                    <div key={uuidv4()} className="px-1">
                        <Chip
                            color="primary"
                            size="sm"
                            variant="dot"
                            >
                        {item.filter.positionFilter.title}
                        </Chip>
                    </div>
                }
                {item.query.map((tag, index) => {
                    const tagID = uuidv4();
                    return (
                        <div key={tagID} className="px-1">
                            <Chip color="secondary" size="sm" variant="dot">
                                {tag}
                            </Chip>
                        </div>
                    );
                })}
                {item.filter.countryCodeFilter.map((countryCode) => {
                    const filterTagID = uuidv4();
                    return (
                        <div key={filterTagID} className="px-1">
                            <Chip color="danger" size="sm" variant="dot">
                                {locationLookup[countryCode]}
                            </Chip>
                        </div>
                    );
                })}
                {item.filter.statusFilter.map((status) => {
                    const filterTagID = uuidv4();
                    return (
                        <div key={filterTagID} className="px-1">
                            <Chip className="capitalize" color="danger" size="sm" variant="dot">
                                {status === "newApply" ? "New" : status}
                            </Chip>
                        </div>
                    );
                })}
                {item.filter.starsFilter !== -1 &&
                    <div className="px-1">
                        <Chip color="danger" size="sm" variant="dot">
                            {`${item.filter.starsFilter}+`}
                        </Chip>
                    </div>
                }
                {(item.filter.yoeFilter.min !== -1 || item.filter.yoeFilter.max !== -1) &&
                    <div className="px-1">
                        <Chip color="danger" size="sm" variant="dot">
                            {(item.filter.yoeFilter.min === -1 ? `YOE <= ${item.filter.yoeFilter.max}` : (item.filter.yoeFilter.max === -1 ? `YOE >= ${item.filter.yoeFilter.min}` : `${item.filter.yoeFilter.min} <= YOE <= ${item.filter.yoeFilter.max}`))}
                        </Chip>
                    </div>
                }
            </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-end pr-unit-2">
            <Tooltip content="Save Query" color={"primary"} delay={400} closeDelay={600}>
              <Button isIconOnly size="sm" variant="light"
                onPress = {async () => {
                    setSavedQueriesState((prev) => {return {...prev, savedQueries: [{id: item.id, query: item.query, filter: item.filter}, ...prev.savedQueries]};});
                    await fetch("/api/query/save-query", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({id: item.id, query: item.query, filter: item.filter})
                    });
                }}
              >
                <span className="text-lg text-primary-400 cursor-pointer active:opacity-50">
                    <BookmarkBorderIcon />
                </span>
              </Button>
            </Tooltip>
            <Tooltip content="Reload Query" color={"secondary"} delay={400} closeDelay={600}>
              <Button isIconOnly size="sm" variant="light"
                onPress = {async () => {
                    setTags(item.query);
                    setFilter(item.filter);
                    setActiveTab("query-terminal");
                }}
              >
                <span className="text-lg text-secondary-400 cursor-pointer active:opacity-50">
                    <ReplayOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, [setSavedQueriesState, setActiveTab, setTags, setFilter]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-auto h-full">
        <Table isStriped aria-label="Example table with custom cells" className="flex-auto h-full">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "end" : "start"} className={column.uid === "actions" ? "text-end pr-unit-5" : "text-start pl-unit-5"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={recentQueriesState.loading ? " " : "No recent queries found."} items={recentQueriesState.recentQueries} isLoading={recentQueriesState.loading} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label="Loading recent queries..." color="warning" labelColor="warning" />}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}