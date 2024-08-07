"use client";

import { useMemo, useCallback, useState, Key } from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Spinner } from "@nextui-org/spinner";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Tooltip } from "@nextui-org/tooltip";
import { Pagination } from "@nextui-org/pagination";
import { Link } from "@nextui-org/link";

import { ChevronDownIcon } from "@/app/utils/chevron-down-icon";
import { capitalize } from "@/app/utils";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import NextWeekOutlinedIcon from "@mui/icons-material/NextWeekOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';

import { useAdmin } from "@/app/managers";

import type { Position } from "@/types";

import { isPositionStatus } from "@/types/validations";

import { POSITION_STATUS_COLOR_MAP } from "@/app/constants";

import { getPositionStatusColor } from "@/app/utils";

import BASE_URL from "@/app/utils/base-url";

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "POSITION", uid: "position", sortable: true },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "Open", uid: "open" },
  { name: "Closed", uid: "closed" },
];

const statusSet = new Set(statusOptions.map((status) => status.uid));
statusSet.delete("All");

const statusArray = Object.keys(POSITION_STATUS_COLOR_MAP);

const eqSet = (xs: Set<any>, ys: Set<any>) =>
  xs.size === ys.size && Array.from(xs).every((x) => ys.has(x));

const inSet = (xs: Set<any>, ys: Set<any>) =>
  Array.from(xs).every((x) => ys.has(x));

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Tooltip
      content="Share Position"
      color={"default"}
      delay={400}
      closeDelay={600}
    >
      <Button
        isIconOnly
        variant="light"
        aria-label="Share Position"
        size="sm"
        onPress={() => {
          navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1500);
        }}
      >
        <span
          className="text-lg text-default-500 cursor-pointer active:opacity-50"
        >
          {copied ? <DoneOutlinedIcon /> : <InsertLinkOutlinedIcon />}
        </span>
      </Button>
    </Tooltip>
  );
}

export function PositionTable() {
  const {
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
  } = useAdmin();

  const hasSearchFilter = Boolean(positionSearchText);

  const headerColumns = columns;

  const filteredItems = useMemo(() => {
    let filteredPositions = [...positions];

    if (hasSearchFilter) {
      filteredPositions = filteredPositions.filter((position) =>
        position.name.toLowerCase().includes(positionSearchText.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredPositions = filteredPositions.filter((position) =>
        position.status === "open"
          ? Array.from(statusFilter).includes("open")
          : Array.from(statusFilter).includes("closed")
      );
    }
    return filteredPositions;
  }, [positions, positionSearchText, statusFilter, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (tablePage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [tablePage, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items];
  }, [items]);

  const renderCell = useCallback(
    (position: Position, columnKey: Key) => {
      switch (columnKey) {
        case "id":
          return <p className="text-bold text-sm">{position.id}</p>;
        case "position":
          return (
            <p className="text-bold text-sm capitalize">{position.name}</p>
          );
        case "status":
          const positionStatus = position.status;
          if (position.id === 1) {
            return (
              <Chip
                color="primary"
                size="sm"
                variant="solid"
                className="capitalize"
              >
                {positionStatus}
              </Chip>
            );
          }
          return (
            <Dropdown className="min-w-0 w-fit">
              <DropdownTrigger>
                <button>
                  <Chip
                    className="capitalize"
                    color={position.status === "open" ? "danger" : "default"}
                    size="sm"
                    variant="solid"
                    endContent={<ArrowDropDownOutlinedIcon />}
                  >
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
                onSelectionChange={async (keys) => {
                  const res = await fetch(
                    `/api/positions/set-positions-status`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        positions: [position],
                        status: Array.from(keys)[0],
                      }),
                    }
                  );

                  if (res.status !== 200) {
                    console.error("Failed to set position status");
                  } else {
                    setPositions((prev) => {
                      return prev.map((pair) => {
                        const newStatus = Array.from(keys)[0];
                        if (
                          pair.id === position.id &&
                          isPositionStatus(newStatus)
                        ) {
                          return { ...pair, status: newStatus };
                        }
                        return pair;
                      });
                    });
                  }
                }}
              >
                {["open", "closed"].map((status) => (
                  <DropdownItem key={status} textValue={status}>
                    <Chip
                      className="capitalize"
                      color={status === "open" ? "danger" : "default"}
                      size="sm"
                      variant="solid"
                    >
                      {status}
                    </Chip>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          );
        case "actions":
          return (
            <div className="flex flex-row gap-0">
              <CopyButton url={`${BASE_URL}/apply/${position.id}`} />
              <Tooltip
                content="Delete Position"
                color={"danger"}
                delay={400}
                closeDelay={600}
              >
                <Button
                  isIconOnly
                  variant="light"
                  aria-label="Delete Position"
                  size="sm"
                  isDisabled={position.id === 1}
                  onPress={async () => {
                    if (position.id === 1) {
                      return;
                    }
                    setPositionsLoading((prev) => {
                      return true;
                    });
                    const res = await fetch(`/api/positions/delete-positions`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ positions: [position] }),
                    });

                    if (res.status !== 200) {
                      console.error("Failed to delete position");
                    } else {
                      setPositions((prev) => {
                        return prev.filter((pair) => {
                          return pair.id !== position.id;
                        });
                      });
                    }
                    setPositionsLoading((prev) => {
                      return false;
                    });
                  }}
                >
                  <span
                    className={
                      position.id === 1
                        ? "text-lg text-default-400 cursor-pointer active:opacity-50"
                        : "text-lg text-danger-400 cursor-pointer active:opacity-50"
                    }
                  >
                    <DeleteOutlinedIcon />
                  </span>
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return "?";
      }
    },
    [setPositions, setPositionsLoading]
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setTablePage(1);
    },
    [setTablePage, setRowsPerPage]
  );

  const onSearchChange = useCallback(
    (value: string) => {
      if (value) {
        setPositionSearchText(value);
        setTablePage(1);
      } else {
        setPositionSearchText("");
      }
    },
    [setPositionSearchText, setTablePage]
  );

  const onClear = useCallback(() => {
    setPositionSearchText("");
    setTablePage(1);
  }, [setPositionSearchText, setTablePage]);

  const topContent = useMemo(() => {
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
            classNames={{ inputWrapper: "h-10" }}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                  color={
                    statusFilter === "all" || inSet(statusSet, statusFilter)
                      ? "default"
                      : "danger"
                  }
                >
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
                  if (!Array.from(keys).every((key) => isPositionStatus(key))) {
                    return;
                  }
                  setStatusFilter(new Set(Array.from(keys)) as Set<"open" | "closed">);
                }}
              >
                {statusOptions.map((status) => (
                  <DropdownItem
                    key={status.uid}
                    className="capitalize"
                    variant="bordered"
                  >
                    {
                      <Chip
                        color={
                          isPositionStatus(status.uid)
                            ? getPositionStatusColor(status.uid)
                            : "default"
                        }
                        size="sm"
                      >
                        {capitalize(status.name)}
                      </Chip>
                    }
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [onClear, positionSearchText, statusFilter, onSearchChange]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <Tooltip
            content="Delete Selected Positions"
            color={"danger"}
            delay={400}
            closeDelay={600}
          >
            <Button
              isIconOnly
              variant="light"
              aria-label="Delete Position"
              size="sm"
              onPress={async () => {
                if (
                  !selectedKeys ||
                  (selectedKeys !== "all" && new Set(selectedKeys).size === 0)
                ) {
                  return;
                }
                setPositionsLoading((prev) => {
                  return true;
                });
                const res = await fetch(`/api/positions/delete-positions`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    positions: positions.filter((position) => {
                      return new Set(selectedKeys).has(`${position.id}`);
                    }),
                  }),
                });
                if (res.status !== 200) {
                  console.error("Failed to delete positions");
                } else {
                  setPositions((prev) => {
                    return prev.filter((position) => {
                      return (
                        !new Set(selectedKeys).has(`${position.id}`) ||
                        position.id === 1
                      );
                    });
                  });
                  setSelectedKeys(new Set([]));
                }
                setPositionsLoading((prev) => {
                  return false;
                });
              }}
            >
              <span className="text-danger-400 cursor-pointer active:opacity-50">
                <DeleteOutlinedIcon />
              </span>
            </Button>
          </Tooltip>
          <Dropdown className="min-w-0 w-fit">
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                aria-label="Change Positions Status"
                size="sm"
              >
                <Tooltip
                  content="Change Status of Selected Positions"
                  color={"warning"}
                  delay={400}
                  closeDelay={600}
                >
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
              onSelectionChange={async (keys) => {
                if (!selectedKeys || keys === "all") {
                  return;
                }
                if (
                  !keys ||
                  keys.size !== 1 ||
                  new Set(selectedKeys).size === 0
                ) {
                  return;
                }
                const newKey = Array.from(keys)[0];
                if (!isPositionStatus(newKey)) {
                  return;
                }
                setPositionsLoading((prev) => {
                  return true;
                });
                let changePositions =
                  selectedKeys === "all"
                    ? positions
                    : positions.filter((position) => {
                        return new Set(selectedKeys).has(`${position.id}`);
                      });

                const res = await fetch(`/api/positions/set-positions-status`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    positions: changePositions,
                    status: newKey,
                  }),
                });

                if (res.status !== 200) {
                  console.error("Failed to set position status");
                } else {
                  setPositions((prev) => {
                    return prev.map((pair) => {
                      if (
                        (selectedKeys === "all" ||
                          new Set(selectedKeys).has(`${pair.id}`)) &&
                        pair.id !== 1
                      ) {
                        return { ...pair, status: newKey };
                      }
                      return pair;
                    });
                  });
                }
                setPositionsLoading((prev) => {
                  return false;
                });
              }}
            >
              {statusArray.map((key) => (
                <DropdownItem
                  key={key}
                  textValue={key === "newApply" ? "new" : key}
                >
                  <Chip
                    className="capitalize"
                    color={
                      isPositionStatus(key)
                        ? getPositionStatusColor(key)
                        : "default"
                    }
                    size="sm"
                    variant="solid"
                  >
                    {key === "newApply" ? "New" : key}
                  </Chip>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <span className="whitespace-nowrap w-[30%] text-small text-default-40 ml-2">
            {selectedKeys === "all"
              ? "All items selected"
              : selectedKeys === undefined
              ? "No items selected"
              : `${new Set(selectedKeys).size} of ${
                  filteredItems.length
                } items`}
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
  }, [
    positions,
    setPositions,
    setPositionsLoading,
    onRowsPerPageChange,
    selectedKeys,
    tablePage,
    pages,
    filteredItems,
    setTablePage,
    setSelectedKeys,
  ]);

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
      <TableBody
        emptyContent={
          positionsLoading ? " " : "Run a query to find positions..."
        }
        items={sortedItems}
        isLoading={positionsLoading}
        loadingContent={
          <Spinner
            className="h-full w-full bg-default-50/75"
            label="Loading Positions..."
            color="danger"
            labelColor={"danger"}
            size="lg"
          />
        }
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
