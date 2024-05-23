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
  {name: "NAME", uid: "name", sortable: true},
  {name: "STATUS", uid: "status", sortable: true},
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


export default function ApplyTable({
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
      case "name":
        return (
          <p className="text-bold text-sm capitalize">{position.name}</p>
        );
      case "status":
        const positionStatus = position.status;
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
                            console.log(keys);
                            /*
                            await fetch(`/api/set-applicant-status`, {
                                method: "POST",
                                headers: {
                                "Content-Type": "application/json",
                                },
                                body: JSON.stringify({id: cardID, status: Array.from(keys)[0]}),
                            });
                            
                            setTableInfo((prevTableInfo) => {
                                const updatedTableInfo = { ...prevTableInfo };
                                updatedTableInfo[cardID].status = Array.from(keys)[0];
                                return updatedTableInfo;
                            });*/
                            setAppliedPositions((prev) => {
                                const newPositions = [...prev];
                                const positionIndex = newPositions.findIndex((pos) => {return pos.name === position.name;});
                                newPositions[positionIndex].status = Array.from(keys)[0];
                                return newPositions;
                            });
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
            <Tooltip content="Delete Applicant" color={"danger"} delay={400} closeDelay={600}>
              <Button isIconOnly variant="light" aria-label="Delete Applicant" size="sm" isDisabled={position.name === "General Application"}
                onPress={async () => {
                  setAppliedPositionsLoading((prev) => {return true;});
                  await fetch(`/api/delete-positions`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({names: [position.name]}),
                  });

                  setAppliedPositions((prev) => {return prev.filter((pair) => pair.name !== position.name);});
                  setAppliedPositionsLoading((prev) => {return false;});
                }}
              >
                <span className={position.name === "General Application" ? "text-lg text-default-400 cursor-pointer active:opacity-50" : "text-lg text-danger-400 cursor-pointer active:opacity-50"}>
                  <DeleteOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
        );
      default:
        return "?";
    }
  }, [setAppliedPositions, setAppliedPositionsLoading]);

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
          <TableRow key={item.name}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
