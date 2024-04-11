"use client";

import React, { useState, useEffect } from 'react';
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {Tooltip} from "@nextui-org/tooltip";
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {Button} from "@nextui-org/button";
import {Spinner} from "@nextui-org/spinner";


const columns = [
    {name: "QUERY", uid: "query"},
    {name: "ACTIONS", uid: "actions"},
  ];

export default function SavedQueries({
    savedQueries,
    setSavedQueries,
    setQueryText,
    loadingSavedQueries,
    setActiveTab,
    setVarColor,
    emptySavedQueries,
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
            <Tooltip content="Delete Query" color={"danger"} delay={400} closeDelay={600}>
              <Button isIconOnly size="sm" variant="light"
                onPress = {async () => {
                    setSavedQueries(savedQueries.filter(i => i.id !== item.id));
                    await fetch("/api/delete-query", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({id: item.id, query: item.query})
                    });
                }}
              >
                <span className="text-lg text-danger-400 cursor-pointer active:opacity-50">
                    <DeleteOutlinedIcon />
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
          <TableBody emptyContent={emptySavedQueries} items={savedQueries} isLoading={loadingSavedQueries} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label="Loading saved queries..." color="primary" labelColor="primary" />}>
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