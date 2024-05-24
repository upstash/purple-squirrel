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
  {name: "ID", uid: "id", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "STATUS", uid: "status"},
];

const statusOptions = [
  {name: "All", uid: "All"},
  {name: "New", uid: "newApply"},
  {name: "Screening", uid: "screening"},
  {name: "Assessment", uid: "assessment"},
  {name: "Interview", uid: "interview"},
  {name: "Shortlisted", uid: "shortlisted"},
  {name: "Offer", uid: "offer"},
  {name: "Onboarding", uid: "onboarding"},
  {name: "Hired", uid: "hired"},
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

const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

const inSet = (xs, ys) =>
    [...xs].every((x) => ys.has(x));


export default function AppliedTable({
    appliedPositions,
    setAppliedPositions,
    appliedPositionsLoading,
    setAppliedPositionsLoading,
    appliedPositionSearchText,
    setAppliedPositionSearchText,
    appliedRowsPerPage,
    setAppliedRowsPerPage,
    appliedTablePage,
    setAppliedTablePage,
}) {

  const hasSearchFilter = Boolean(appliedPositionSearchText);

  const headerColumns = columns;

  const filteredItems = React.useMemo(() => {
    let filteredPositions = [...appliedPositions];

    if (hasSearchFilter) {
      filteredPositions = filteredPositions.filter((position) =>
        position.name.toLowerCase().includes(appliedPositionSearchText.toLowerCase()),
      );
    }
    return filteredPositions;
  }, [appliedPositions, appliedPositionSearchText, hasSearchFilter]);
  
  const pages = Math.ceil(filteredItems.length / appliedRowsPerPage);

  const items = React.useMemo(() => {
    const start = (appliedTablePage - 1) * appliedRowsPerPage;
    const end = start + appliedRowsPerPage;

    return filteredItems.slice(start, end);
  }, [appliedTablePage, filteredItems, appliedRowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items]
  }, [items]);

  const renderCell = React.useCallback((position, columnKey) => {
    switch (columnKey) {
      case "id":
        return (
          <p className="text-bold text-sm">{position.id}</p>
        );
      case "name":
        return (
          <p className="text-bold text-sm capitalize">{position.name}</p>
        );
      case "status":
        const positionStatus = position.status;
        return (
          <Chip className="capitalize" color={statusColorMap[positionStatus]} size="sm" variant="solid">
            {(positionStatus === "newApply") ? "new" : positionStatus}
          </Chip>
        );
      default:
        return "?";
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setAppliedRowsPerPage(Number(e.target.value));
    setAppliedTablePage(1);
  }, [setAppliedTablePage, setAppliedRowsPerPage]);


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
            color="primary"
            page={appliedTablePage}
            total={pages}
            onChange={setAppliedTablePage}
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
  }, [pages, onRowsPerPageChange, appliedTablePage, setAppliedTablePage]);

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
      <TableBody emptyContent={(appliedPositionsLoading ? " " : "Run a query to find positions...")} items={sortedItems} isLoading={appliedPositionsLoading} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label="Loading Applied Positions..." color="primary" labelColor={"primary"} size="lg" />}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
