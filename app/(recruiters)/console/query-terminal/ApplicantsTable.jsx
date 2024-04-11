"use client";

import React, { useEffect } from "react";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {Spinner} from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import {Input} from "@nextui-org/input";
import {Chip} from "@nextui-org/chip";
import {Tooltip} from "@nextui-org/tooltip";
import {Pagination} from "@nextui-org/pagination";

import {ChevronDownIcon} from "./ChevronDownIcon";
import {capitalize} from "./utils";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';

const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "SCORE", uid: "score", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "AGE", uid: "age", sortable: true},
  {name: "ROLE", uid: "role"},
  {name: "TEAM", uid: "team"},
  {name: "LOCATION", uid: "location"},
  {name: "STATUS", uid: "status", sortable: true},
  {name: "STARS", uid: "stars", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  {name: "All", uid: "All"},
  {name: "New", uid: "newApply"},
  {name: "Screening", uid: "screening"},
  {name: "Assessment", uid: "assessment"},
  {name: "Interview", uid: "interview"},
  {name: "Consideration", uid: "consideration"},
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
  consideration: "danger",
  offer: "secondary",
  onboarding: "success",
  hired: "success",
};

const statusArray = Object.keys(statusColorMap);

const teamOptions = [
  {name: "All", uid: "All"},
  {name: "Development", uid: "Development"},
  {name: "Design", uid: "Design"},
  {name: "Management", uid: "Management"},
  {name: "HR", uid: "HR"},
  {name: "Sales and Marketing", uid: "Sales and Marketing"},
  {name: "Customer Support", uid: "Customer Support"},
  {name: "Quality Assurance", uid: "Quality Assurance"},
  {name: "Operations", uid: "Operations"},
  {name: "Finance and Accounting", uid: "Finance and Accounting"},
];

const teamSet = new Set(teamOptions.map((team) => team.uid));
teamSet.delete("All");

const starsOptions = [
  {name: "No Filter", uid: "No Filter"},
  {name: "1+", uid: "1"},
  {name: "2+", uid: "2"},
  {name: "3+", uid: "3"},
  {name: "4+", uid: "4"},
  {name: "5+", uid: "5"},
];

const starsSet = new Set(["No Filter"]);

const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

const inSet = (xs, ys) =>
    [...xs].every((x) => ys.has(x));


export default function ApplicantsTable({
  applicantIDs,
  setApplicantIDs,
  setFilteredApplicantIDs,
  tableInfo,
  setTableInfo,
  loadingColor,
  setLoadingColor,
  loadingText,
  setLoadingText,
  isLoading,
  setIsLoading,
  emptyContent,
  cardID,
  setCardID,
  setDisplayCard,
  setCardScore,
  filterValue,
  setFilterValue,
  selectedKeys,
  setSelectedKeys,
  visibleColumns,
  setVisibleColumns,
  statusFilter,
  setStatusFilter,
  teamFilter,
  setTeamFilter,
  starsFilter,
  setStarsFilter,
  rowsPerPage,
  setRowsPerPage,
  sortDescriptor,
  setSortDescriptor,
  tablePage,
  setTablePage,
}) {

  const [childFilteredApplicantIDs, setChildFilteredApplicantIDs] = React.useState([]);

  const cardIDRef = React.useRef(cardID);
  cardIDRef.current = cardID;

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredApplicants = [...applicantIDs];

    if (hasSearchFilter) {
      filteredApplicants = filteredApplicants.filter(({id, score}) =>
        tableInfo[id].name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredApplicants = filteredApplicants.filter(({id, score}) =>
        Array.from(statusFilter).includes(tableInfo[id].status),
      );
    }
    if (teamFilter !== "all" && Array.from(teamFilter).length !== teamOptions.length) {
      filteredApplicants = filteredApplicants.filter(({id, score}) =>
        Array.from(teamFilter).includes(tableInfo[id].team),
      );
    }
    const [insideStarsFilter] = starsFilter;
    if (insideStarsFilter !== "No Filter") {
      filteredApplicants = filteredApplicants.filter(({id, score}) =>
        tableInfo[id].stars >= parseInt(insideStarsFilter),
      );
    }
    setChildFilteredApplicantIDs((prev) => filteredApplicants.map((item) => ({id: item.id, score: item.score})));
    filteredApplicants = filteredApplicants.map(({id, score}) => ({id: id, score: score, info: {...tableInfo[id]}}));

    return filteredApplicants;
  }, [filterValue, statusFilter, hasSearchFilter, applicantIDs, tableInfo, teamFilter, starsFilter, setChildFilteredApplicantIDs]);

  useEffect(() => {
    setFilteredApplicantIDs(childFilteredApplicantIDs);
  }, [childFilteredApplicantIDs, setFilteredApplicantIDs]);
  
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (tablePage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [tablePage, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((applicant, columnKey) => {
    const applicantID = applicant.id;
    const info = applicant.info;
    switch (columnKey) {
      case "score":
        const applicantScore = Math.round(applicant.score * 100);
        return (
          <div>
            <p className={(applicantScore > 89) ? "text-bold text-lg bg-gradient-to-r from-secondary to-secondary-400 bg-clip-text text-transparent w-min" : (applicantScore > 79) ? "text-bold text-lg bg-gradient-to-r from-success to-success-300 bg-clip-text text-transparent w-min" : (applicantScore > 49) ? "text-bold text-lg bg-gradient-to-r from-warning to-warning-300 bg-clip-text text-transparent w-min" : "text-bold text-lg bg-gradient-to-r from-danger to-danger-300 bg-clip-text text-transparent w-min"}>{Math.round(applicantScore)}</p>
          </div>
        );
      case "name":
        return (
          <p className="text-bold text-sm capitalize">{info.name}</p>
        );
      case "team":
        return (
          <p className="text-bold text-sm capitalize">{info.team}</p>
        );
      case "role":
        return (
          <p className="text-bold text-sm capitalize">{info.role}</p>
        );
      case "location":
        return (
          <p className="text-bold text-sm capitalize">{info.location}</p>
        );
      case "stars":
        const applicantStars = info.stars;
        return (
          <div>
            <span className="flex text-large cursor-pointer active:opacity-50">
              {Array.from({ length: 5 }).map((_, index) =>
                index < applicantStars ? <StarOutlinedIcon key={index} className={(applicantStars === 0) ? "text-large text-default" : "text-large"}/> : <StarBorderOutlinedIcon key={index} className={(applicantStars === 0) ? "text-large text-default" : "text-large"}/>
              )}
            </span>
          </div>
        );
      case "status":
        const applicantStatus = info.status;
        return (
          <Chip className="capitalize" color={statusColorMap[applicantStatus]} size="sm" variant="solid">
            {(applicantStatus === "newApply") ? "new" : applicantStatus}
          </Chip>
        );
      case "age":
        return (
          <p className="text-bold text-sm capitalize">{info.age}</p>
        );
      case "id":
        return (
          <p className="text-bold text-sm capitalize">{applicantID}</p>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-0 justify-end pr-unit-2">
            <Tooltip content="Delete Applicant" color={"danger"} delay={400} closeDelay={600}>
              <Button isIconOnly variant="light" aria-label="Delete Applicant" size="sm"
                onPress={async () => {
                  if (applicantID === cardIDRef.current) {
                    setDisplayCard(false);
                  }
                  setLoadingText("Deleting Applicant...");
                  setLoadingColor("danger");
                  setIsLoading(true);
                  await fetch(`/api/delete-applicants`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ids: [applicantID]}),
                  });
                  setApplicantIDs((prevApplicantIDs) => prevApplicantIDs.filter((pair) => pair.id !== applicantID));
                  setTableInfo(prevTableInfo => {
                    const updatedTableInfo = { ...prevTableInfo };
                    delete updatedTableInfo[applicantID];
                    return updatedTableInfo;
                  });
                  setIsLoading(false);
                }}
              >
                <span className="text-lg text-danger-400 cursor-pointer active:opacity-50">
                  <DeleteOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
            <Tooltip content="View Resume" color={"default"} delay={400} closeDelay={600}>
              <Button isIconOnly isExternal as={Link} href={info.resumeUrl} variant="light" aria-label="View Resume" size="sm">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <InsertDriveFileOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
            <Tooltip content="View Applicant" color={"default"} delay={400} closeDelay={600}>
              <Button isIconOnly variant="light" aria-label="View Applicant" size="sm"
                onPress={() => {
                  setCardID(applicantID);
                  setCardScore(Math.round(applicant.score * 100));
                  setDisplayCard(true);
                }}>
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <VisibilityOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return "?";
    }
  }, [setTableInfo, setCardID, setDisplayCard, setCardScore, setApplicantIDs, setIsLoading, setLoadingColor, setLoadingText]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setTablePage(1);
  }, [setTablePage, setRowsPerPage]);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setTablePage(1);
    } else {
      setFilterValue("");
    }
  }, [setFilterValue, setTablePage]);

  const onClear = React.useCallback(()=>{
    setFilterValue("")
    setTablePage(1)
  },[setFilterValue, setTablePage])

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
            radius="md"
            classNames={{inputWrapper: "h-10"}}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" color={teamFilter === "all" || inSet(teamSet, teamFilter) ? "default" : "secondary"}>
                  Team
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={teamFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  if (teamFilter === "all") {
                    if (!keys.has("All")) {
                      setTeamFilter((prev) => (new Set([])));
                      return;
                    } else {
                      keys.delete("All");
                      setTeamFilter((prev) => (keys));
                      return;
                    }
                  }
                  if (teamFilter.has("All")) {
                    if (!keys.has("All")) {
                      setTeamFilter((prev) => (new Set([])));
                      return;
                    } else {
                      keys.delete("All");
                      setTeamFilter((prev) => (keys));
                      return;
                    }
                  }
                  if (keys.has("All")) {
                    setTeamFilter((prev) => {
                      const newTeamSet = new Set(teamSet);
                      newTeamSet.add("All");
                      return newTeamSet;
                    });
                    return;
                  } else {
                    if (eqSet(keys, teamSet)) {
                      keys.add("All");
                    }
                    setTeamFilter((prev) => (keys));
                    return;
                  }
                }}
              >
                {teamOptions.map((team) => (
                  <DropdownItem key={team.uid} className={team.uid === "All" ? "capitalize text-danger" : "capitalize"} variant="bordered" >
                    {(team.uid === "All") ? (teamFilter === "all" || teamFilter.has("All") ? "Deselect All" : "Select All") : capitalize(team.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" color={statusFilter === "all" || inSet(statusSet, statusFilter) ? "default" : "secondary"}>
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
                    {(status.uid === "All") ? (statusFilter === "all" || statusFilter.has("All") ? "Deselect All" : "Select All") : capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" color={eqSet(starsFilter, starsSet) ? "default" : "secondary"}>
                  Stars
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={true}
                selectedKeys={starsFilter}
                selectionMode="single"
                onSelectionChange={setStarsFilter}
              >
                {starsOptions.map((stars) => (
                  <DropdownItem key={stars.uid} className="capitalize" >
                    {capitalize(stars.name)}
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
          </div>
        </div>
      </div>
    );
  }, [
    onClear,
    filterValue,
    statusFilter,
    setStatusFilter,
    visibleColumns,
    setVisibleColumns,
    onSearchChange,
    teamFilter,
    setTeamFilter,
    starsFilter,
    setStarsFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <Tooltip content="Delete Selected Applicants" color={"danger"} delay={400} closeDelay={600}>
            <Button isIconOnly variant="light" aria-label="Delete Applicant" size="sm"
              onPress={async () => {
                if (selectedKeys.size === 0) {
                  return;
                }
                if (selectedKeys === "all" || selectedKeys.has(cardIDRef.current)) {
                  setDisplayCard(false);
                }
                setLoadingText("Deleting Selected Applicants...");
                setLoadingColor("danger");
                setIsLoading(true);
                await fetch(`/api/delete-applicants`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ids: (selectedKeys === "all" ? applicantIDs.map((i) => i.id) : [...selectedKeys])}),
                });
                setApplicantIDs((prevApplicantIDs) => prevApplicantIDs.filter((pair) => (selectedKeys === "all" ? false : !selectedKeys.has(pair.id))));
                setTableInfo(prevTableInfo => {
                  if (selectedKeys === "all") {
                    return {};
                  }
                  const updatedTableInfo = { ...prevTableInfo };
                  selectedKeys.forEach((id) => {
                    delete updatedTableInfo[id];
                  });
                  return updatedTableInfo;
                });
                setSelectedKeys(new Set([]));
                setIsLoading(false);
              }}
            >
              <span className="text-danger-400 cursor-pointer active:opacity-50">
                <DeleteOutlinedIcon />
              </span>
            </Button>
          </Tooltip>
          <Dropdown className="min-w-0 w-fit">
            <DropdownTrigger>
                <Button isIconOnly variant="light" aria-label="Change Applicants Status" size="sm">
                  <Tooltip content="Change Status of Selected Applicants" color={"warning"} delay={400} closeDelay={600}>
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
                        const newKey = Array.from(keys)[0];
                        let newSelectedKeys;
                        if (selectedKeys === "all") {
                          newSelectedKeys = applicantIDs.map((i) => i.id);
                        } else {
                          newSelectedKeys = [...selectedKeys];
                        }

                        await fetch(`/api/set-multiple-applicant-status`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ids: newSelectedKeys, status: newKey}),
                          });

                        setTableInfo((prevTableInfo) => {
                            const updatedTableInfo = { ...prevTableInfo };
                            newSelectedKeys.forEach((id) => {
                                updatedTableInfo[id].status = newKey;
                            });
                            return updatedTableInfo;
                        });
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
  }, [onRowsPerPageChange, selectedKeys, tablePage, pages, setIsLoading, setLoadingColor, setLoadingText, setTableInfo, setApplicantIDs, filteredItems, cardIDRef, setDisplayCard, applicantIDs, setTablePage, setSelectedKeys]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      radius="md"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      className="h-full"
      classNames={{
        wrapper: "max-h-[calc(100vh-21rem)] flex-auto",
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
      <TableBody emptyContent={emptyContent} items={sortedItems} isLoading={isLoading} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label={loadingText} color={loadingColor} labelColor={loadingColor} size="lg" />}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
