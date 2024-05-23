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
  {name: "POSITION", uid: "position", sortable: true},
  {name: "STATUS", uid: "status"},
  {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  {name: "All", uid: "All"},
  {name: "Open", uid: "open"},
  {name: "Closed", uid: "closed"},
];

const statusSet = new Set(statusOptions.map((status) => status.uid));
statusSet.delete("All");

const statusColorMap = {
  open: "danger",
  closed: "default",
};

const statusArray = Object.keys(statusColorMap);

const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

const inSet = (xs, ys) =>
    [...xs].every((x) => ys.has(x));


export default function PositionTable({
    positions,
    setPositions,
    positionsLoading,
    setPositionsLoading,
    positionSearchText,
    setPositionSearchText,
    statusFilter,
    setStatusFilter,
    rowsPerPage,
    setRowsPerPage,
    tablePage,
    setTablePage,
    selectedKeys,
    setSelectedKeys,
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
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredPositions = filteredPositions.filter((position) =>
        Array.from(statusFilter).includes(position.status),
      );
    }
    return filteredPositions;
  }, [positions, positionSearchText, statusFilter, hasSearchFilter]);
  
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
      case "id":
        return (
          <p className="text-bold text-sm">{position.id}</p>
        );
      case "position":
        return (
          <p className="text-bold text-sm capitalize">{position.name}</p>
        );
      case "status":
        const positionStatus = position.status;
        if (position.id === 1) {
          return (
            <Chip color="primary" size="sm" variant="solid" className="capitalize">
              {positionStatus}
            </Chip>
          );
        }
        return (
            <Dropdown className="min-w-0 w-fit">
                <DropdownTrigger>
                    <button>
                        <Chip className="capitalize" color={position.status === "open" ? "danger" : "default"} size="sm" variant="solid" endContent={<ArrowDropDownOutlinedIcon/>}>
                            {position.status}
                        </Chip>
                    </button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Single selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedKeys={new Set([position.status])}
                    className="min-w-0 w-fit"
                    onSelectionChange={
                        async (keys) => {
                            const res = await fetch(`/api/positions/set-positions-status`, {
                                method: "POST",
                                headers: {
                                "Content-Type": "application/json",
                                },
                                body: JSON.stringify({positions: [position], status: Array.from(keys)[0]}),
                            });

                            if (res.status !== 200) {
                                console.error("Failed to set position status");
                            } else {
                              setPositions((prev) => {
                                return prev.map((pair) => {
                                    if (pair.id === position.id) {
                                        return {...pair, status: Array.from(keys)[0]};
                                    }
                                    return pair;
                                  })
                              });
                            }
                        }
                    }
                >
                    {["open", "closed"].map((status) => 
                        <DropdownItem key={status} textValue={status}>
                            <Chip className="capitalize" color={status === "open" ? "danger" : "default"} size="sm" variant="solid">
                                {status}
                            </Chip>
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        );
      case "actions":
        return (
            <Tooltip content="Delete Position" color={"danger"} delay={400} closeDelay={600}>
              <Button isIconOnly variant="light" aria-label="Delete Position" size="sm" isDisabled={position.id === 1}
                onPress={async () => {
                  if (position.id === 1) {
                    return;
                  }
                  setPositionsLoading((prev) => {return true;});
                  const res = await fetch(`/api/positions/delete-positions`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({positions: [position]}),
                  });

                  if (res.status !== 200) {
                    console.error("Failed to delete position");
                  } else {
                    setPositions((prev) => {return prev.filter((pair) => {return pair.id !== position.id;});});
                  }
                  setPositionsLoading((prev) => {return false;});
                }}
              >
                <span className={position.id === 1 ? "text-lg text-default-400 cursor-pointer active:opacity-50" : "text-lg text-danger-400 cursor-pointer active:opacity-50"}>
                  <DeleteOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
        );
      default:
        return "?";
    }
  }, [setPositions, setPositionsLoading]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setTablePage(1);
  }, [setTablePage, setRowsPerPage]);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setPositionSearchText(value);
      setTablePage(1);
    } else {
      setPositionSearchText("");
    }
  }, [setPositionSearchText, setTablePage]);

  const onClear = React.useCallback(()=>{
    setPositionSearchText("")
    setTablePage(1)
  },[setPositionSearchText, setTablePage])

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search positions by name..."
            value={positionSearchText}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            size="sm"
            radius="md"
            classNames={{inputWrapper: "h-10"}}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" color={statusFilter === "all" || inSet(statusSet, statusFilter) ? "default" : "danger"}>
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  if (statusFilter === "all") {
                    if (!keys.has("All")) {
                      setStatusFilter((prev) => (new Set([])));
                      return;
                    } else {
                      keys.delete("All");
                      setStatusFilter((prev) => (keys));
                      return;
                    }
                  }
                  if (statusFilter.has("All")) {
                    if (!keys.has("All")) {
                      setStatusFilter((prev) => (new Set([])));
                      return;
                    } else {
                      keys.delete("All");
                      setStatusFilter((prev) => (keys));
                      return;
                    }
                  }
                  if (keys.has("All")) {
                    setStatusFilter((prev) => {
                      const newStatusSet = new Set(statusSet);
                      newStatusSet.add("All");
                      return newStatusSet;
                    });
                    return;
                  } else {
                    if (eqSet(keys, statusSet)) {
                      keys.add("All");
                    }
                    setStatusFilter((prev) => (keys));
                    return;
                  }
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className={status.uid === "All" ? "capitalize text-danger" : "capitalize"} variant="bordered">
                    {(status.uid === "All") ? (statusFilter === "all" || statusFilter.has("All") ? "Deselect All" : "Select All") : <Chip color={statusColorMap[status.uid]} size="sm">{capitalize(status.name)}</Chip>}
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
    positionSearchText,
    statusFilter,
    setStatusFilter,
    onSearchChange,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <Tooltip content="Delete Selected Positions" color={"danger"} delay={400} closeDelay={600}>
            <Button isIconOnly variant="light" aria-label="Delete Position" size="sm"
              onPress={async () => {
                if (selectedKeys.size === 0) {
                  return;
                }
                setPositionsLoading((prev) => {return true;});
                const res = await fetch(`/api/positions/delete-positions`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({positions: positions.filter((position) => {return selectedKeys.has(`${position.id}`);})}),
                });
                if (res.status !== 200) {
                  console.error("Failed to delete positions");
                } else {
                  setPositions((prev) => {return prev.filter((position) => {return !selectedKeys.has(`${position.id}`) || position.id === 1;});});
                  setSelectedKeys(new Set([]));
                }
                setPositionsLoading((prev) => {return false;});
              }}
            >
              <span className="text-danger-400 cursor-pointer active:opacity-50">
                <DeleteOutlinedIcon />
              </span>
            </Button>
          </Tooltip>
          <Dropdown className="min-w-0 w-fit">
            <DropdownTrigger>
                <Button isIconOnly variant="light" aria-label="Change Positions Status" size="sm">
                  <Tooltip content="Change Status of Selected Positions" color={"warning"} delay={400} closeDelay={600}>
                    <span className="text-warning-400 cursor-pointer active:opacity-50">
                      <NextWeekOutlinedIcon />
                    </span>
                  </Tooltip>
                </Button>
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Single selection example"
                variant="flat"
                selectionMode="single"
                selectedKeys={new Set([])}
                className="min-w-0 w-fit"
                onSelectionChange={
                    async (keys) => {
                        if (!keys || keys.size !== 1 || selectedKeys.size === 0) {
                          return;
                        }
                        setPositionsLoading((prev) => {return true;});
                        const newKey = Array.from(keys)[0];
                        let changePositions = (selectedKeys === "all") ? positions : positions.filter((position) => {return selectedKeys.has(`${position.id}`);});

                        const res = await fetch(`/api/positions/set-positions-status`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({positions: changePositions, status: newKey}),
                          });
                        
                        if (res.status !== 200) {
                          console.error("Failed to set position status");
                        } else {
                          setPositions((prev) => {
                            return prev.map((pair) => {
                              if ((selectedKeys === "all" || selectedKeys.has(`${pair.id}`)) && (pair.id !== 1)) {
                                return {...pair, status: newKey};
                              }
                              return pair;
                            });
                          });
                        }
                        setPositionsLoading((prev) => {return false;});
                    }
                }
            >
                {statusArray.map((key) => 
                    <DropdownItem key={key} textValue={key === "newApply" ? "new" : key}>
                        <Chip className="capitalize" color={statusColorMap[key]} size="sm" variant="solid">
                            {key === "newApply" ? "New" : key}
                        </Chip>
                    </DropdownItem>
                )}
            </DropdownMenu>
          </Dropdown>
          <span className="whitespace-nowrap w-[30%] text-small text-default-40 w-full ml-2">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} items`}
          </span>
        </div>
        <div className="flex-[3_1_0%] flex justify-center items-center w-full">
          <Pagination
            isCompact
            showControls
            showShadow
            color="danger"
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
  }, [positions, setPositions, setPositionsLoading, onRowsPerPageChange, selectedKeys, tablePage, pages, filteredItems, setTablePage, setSelectedKeys]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      radius="md"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      className="h-full"
      classNames={{
        wrapper: "flex-auto",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
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
      <TableBody emptyContent={(positionsLoading ? " " : "Run a query to find positions...")} items={sortedItems} isLoading={positionsLoading} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label="Loading Positions..." color="danger" labelColor={"danger"} size="lg" />}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
