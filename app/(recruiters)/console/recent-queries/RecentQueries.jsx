"use client";

import React from "react";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {Tooltip} from "@nextui-org/tooltip";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import {Spinner} from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";

const columns = [
    {name: "QUERY", uid: "query"},
    {name: "ACTIONS", uid: "actions"},
  ];

export default function RecentQueries({
    recentQueries,
    setQueryText,
    loadingRecentQueries,
    setActiveTab,
    setVarColor,
    savedQueries,
    setSavedQueries,
    emptyRecentQueries,
}) {
  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "query":
        return (
          <div className="flex flex-col pl-unit-2">
            <p className="text-bold text-sm capitalize">{item.query}</p>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2 justify-end pr-unit-2">
            <Tooltip content="Save Query" color={"primary"} delay={400} closeDelay={600}>
              <Button isIconOnly size="sm" variant="light"
                onPress = {async () => {
                    setSavedQueries([{id: item.id, query: item.query}, ...savedQueries]);
                    await fetch("/api/save-query", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({id: item.id, query: item.query})
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
                    setQueryText(item.query);
                    setActiveTab("query-terminal");
                    setVarColor("secondary");
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
  }, [savedQueries, setSavedQueries, setQueryText, setActiveTab, setVarColor]);

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
          <TableBody emptyContent={emptyRecentQueries} items={recentQueries} isLoading={loadingRecentQueries} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label="warning" color="warning" labelColor="warning" />}>
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