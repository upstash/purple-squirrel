"use client";

import React, { useEffect } from "react";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {Spinner} from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Chip} from "@nextui-org/chip";
import {Tooltip} from "@nextui-org/tooltip";
import {Pagination} from "@nextui-org/pagination";
import {Popover, PopoverTrigger, PopoverContent} from "@nextui-org/popover";

import {ChevronDownIcon} from "@/app/utils/ChevronDownIcon";
import {capitalize} from "@/app/utils/utils";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';


const columns = [
  {name: "POSITION", uid: "position", sortable: true},
  {name: "APPLY", uid: "apply"},
];


export default function ApplyTable({
    positions,
    setPositions,
    positionsLoading,
    setPositionsLoading,
    positionSearchText,
    setPositionSearchText,
    rowsPerPage,
    setRowsPerPage,
    tablePage,
    setTablePage,
}) {

  const hasSearchFilter = Boolean(positionSearchText);

  const headerColumns = columns;

  const filteredItems = React.useMemo(() => {
    let filteredPositions = [...positions];

    if (hasSearchFilter) {
      filteredPositions = filteredPositions.filter((position) =>
        position.name.toLowerCase().includes(positionSearchText.toLowerCase()),
      );
    }
    return filteredPositions;
  }, [positions, positionSearchText, hasSearchFilter]);
  
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (tablePage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [tablePage, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items]
  }, [items]);

  const renderCell = React.useCallback((position, columnKey) => {
    switch (columnKey) {
      case "position":
        return (
          <p className="text-bold text-sm capitalize">{position.name}</p>
        );
      case "apply":
        return (
            <Tooltip content="Delete Applicant" color={"danger"} delay={400} closeDelay={600}>
              <Button variant="solid" radius="full" size="sm" color="primary"
                onPress={async () => {
                  setPositionsLoading((prev) => {return true;});
                  await fetch(`/api/applications/apply`, {
                    method: "POST",
                  });
                  //setPositions((prev) => {return prev.filter((pair) => pair.name !== position.name);});
                  setPositionsLoading((prev) => {return false;});
                }}
              >
                Apply
              </Button>
            </Tooltip>
        );
      default:
        return "?";
    }
  }, [setPositionsLoading]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setTablePage(1);
  }, [setTablePage, setRowsPerPage]);


  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">

        </div>
        <div className="flex-[3_1_0%] flex justify-center items-center w-full">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={tablePage}
            total={pages}
            onChange={setTablePage}
          />
        </div>
        <label className="flex-1 flex items-center justify-end text-default-400 text-small w-full">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
      </div>
    );
  }, [onRowsPerPageChange, tablePage, pages, setTablePage]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      radius="md"
      bottomContent={bottomContent}
      bottomContentPlacement="inside"
      className="h-full"
      classNames={{
        wrapper: "flex-auto",
      }}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={"start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={(positionsLoading ? " " : "Run a query to find positions...")} items={sortedItems} isLoading={positionsLoading} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label="Loading Open Positions..." color="secondary" labelColor={"secondary"} size="lg" />}>
        {(item) => (
          <TableRow key={item.name}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
