"use client";

import React from "react";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {Button, ButtonGroup} from "@nextui-org/button";
import {Input} from "@nextui-org/input";
import {Chip} from "@nextui-org/chip";
import {Tooltip} from "@nextui-org/tooltip";
import {Pagination, PaginationItem, PaginationCursor} from "@nextui-org/pagination";

import {ChevronDownIcon} from "./ChevronDownIcon";
import {columns, applicants, statusOptions} from "./mockData";
import {capitalize} from "./utils";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';


const statusColorMap = {
  newApply: "default",
  screening: "warning",
  assessment: "warning",
  interview: "warning",
  consideration: "danger",
  offer: "secondary",
  onboarding: "success",
  hired: "success",
};

const INITIAL_VISIBLE_COLUMNS = ["score", "name", "role", "location", "stars", "status", "actions"];

export default function ApplicantsTable() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "score",
    direction: "descending",
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredApplicants = [...applicants];

    if (hasSearchFilter) {
      filteredApplicants = filteredApplicants.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredApplicants = filteredApplicants.filter((user) =>
        Array.from(statusFilter).includes(user.status),
      );
    }

    return filteredApplicants;
  }, [filterValue, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((applicant, columnKey) => {
    const cellValue = applicant[columnKey];

    switch (columnKey) {
      case "score":
        return (
          <div>
            <p className={(applicant.score > 89) ? "text-bold text-lg bg-gradient-to-r from-secondary to-secondary-400 bg-clip-text text-transparent w-min" : (applicant.score > 79) ? "text-bold text-lg bg-gradient-to-r from-success to-success-300 bg-clip-text text-transparent w-min" : (applicant.score > 49) ? "text-bold text-lg bg-gradient-to-r from-warning to-warning-300 bg-clip-text text-transparent w-min" : "text-bold text-lg bg-gradient-to-r from-danger to-danger-300 bg-clip-text text-transparent w-min"}>{cellValue}</p>
          </div>
        );
      case "name":
        return (
          <p className="text-bold text-sm capitalize">{cellValue}</p>
        );
      case "role":
        return (
          <p className="text-bold text-small capitalize">{cellValue}</p>
        );
      case "location":
        return (
          <p className="text-bold text-sm capitalize">{cellValue}</p>
        );
      case "stars":
        return (
          <div>
            <span className="text-large cursor-pointer active:opacity-50">
              {Array.from({ length: 5 }).map((_, index) =>
                index < applicant.stars ? <StarOutlinedIcon key={index} className={(applicant.stars === 0) ? "text-large text-default" : "text-large"}/> : <StarBorderOutlinedIcon key={index} className={(applicant.stars === 0) ? "text-large text-default" : "text-large"}/>
              )}
            </span>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[applicant.status]} size="sm" variant="flat">
            {(applicant.status === "newApply") ? "new" : applicant.status}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-0 justify-end pr-unit-2">
            <Tooltip content="Delete Applicant" color={"danger"} delay={400} closeDelay={600}>
              <Button isIconOnly variant="light" aria-label="Delete Applicant" size="sm">
                <span className="text-lg text-danger-400 cursor-pointer active:opacity-50">
                  <DeleteOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
            <Tooltip content="View Resume" color={"default"} delay={400} closeDelay={600}>
              <Button isIconOnly variant="light" aria-label="View Resume" size="sm">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <InsertDriveFileOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
            <Tooltip content="View Applicant" color={"default"} delay={400} closeDelay={600}>
              <Button isIconOnly variant="light" aria-label="View Applicant" size="sm">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <VisibilityOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            size="sm"
            classNames={{inputWrapper: "h-10"}}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Stars
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  View
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button isIconOnly color="secondary" variant="solid" size="md">
                  <Tooltip content="Advanced Filters" color={"secondary"}>
                    <FilterAltOutlinedIcon />
                  </Tooltip>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [
    onClear,
    filterValue,
    statusFilter,
    visibleColumns,
    onSearchChange,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center">
        <span className="flex-1 w-[30%] text-small text-default-40 w-full">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <div className="flex-[3_1_0%] flex justify-center items-center w-full">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={setPage}
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
  }, [onRowsPerPageChange, filteredItems.length, selectedKeys, page, pages]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "max-h-[calc(100vh-21rem)]",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            className = {column.uid === "actions" ? "text-end pr-unit-10" : null}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No applicants found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
