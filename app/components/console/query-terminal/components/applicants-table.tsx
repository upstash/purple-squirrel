"use client";

import { useMemo, useCallback, Key } from "react";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownItem} from "@nextui-org/dropdown";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {Spinner} from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import {Chip} from "@nextui-org/chip";
import {Tooltip} from "@nextui-org/tooltip";
import {Pagination} from "@nextui-org/pagination";

import {capitalize} from "@/app/utils";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';

import { LOCATION_LOOKUP, APPLICANT_STATUS_OPTIONS } from "@/app/constants";

import { CSVLink } from "react-csv";

import { useQueryTerminal } from "@/app/managers";

import type { ApplicantRow, Position } from "@/types";

import { isNextUIColor, isApplicantStatus } from "@/types/validations";

import { getApplicantStatusColor } from "@/app/utils";

const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "SCORE", uid: "score", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "POSITION", uid: "position"},
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
  {name: "Shortlisted", uid: "shortlisted"},
  {name: "Offer", uid: "offer"},
  {name: "Onboarding", uid: "onboarding"},
  {name: "Hired", uid: "hired"},
];

const statusSet = new Set(statusOptions.map((status) => status.uid));
statusSet.delete("All");

const getColumnValue = (applicant: ApplicantRow, columnKey: Key | undefined, positions: Position[]) => {
  switch (columnKey) {
    case "score":
      return Math.round(applicant.score * 100);
    case "name":
      return applicant.applicantInfo.name;
    case "position":
      return positions.find((position) => position.id === applicant.positionId)?.name || "Unknown";
    case "location":
      return applicant.countryCode ? LOCATION_LOOKUP[applicant.countryCode] : "Unknown";
    case "stars":
      return applicant.stars;
    case "status":
      return applicant.status;
    case "id":
      return applicant.id;
    default:
      return "?";
  }
}

export function ApplicantsTable() {
  const {applicants, setApplicants, tableLoading, setTableLoading, applicantCard, setApplicantCard, rowsPerPage, tablePage, sortDescriptor, setSortDescriptor, selectedKeys, setSelectedKeys, setTablePage, setRowsPerPage, positions} = useQueryTerminal();

  const headerColumns = useMemo(() => {
    return columns.filter((column) => ["score", "name", "location", "stars", "status", "actions"].includes(column.uid));
  }, []);

  const filteredItems = useMemo(() => {
    let filteredApplicants = [...applicants];
    return filteredApplicants;
  }, [applicants]);
  
  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (tablePage - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [tablePage, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = getColumnValue(a, sortDescriptor.column, positions);
      const second = getColumnValue(b, sortDescriptor.column, positions);
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items, positions]);

  const renderCell = useCallback((applicant: ApplicantRow, columnKey: Key) => {
    const applicantID = applicant.id;
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
          <p className="text-bold text-sm capitalize">{applicant.applicantInfo.name}</p>
        );
      case "position":
        return (
          <p className="text-bold text-sm capitalize">{positions.find((position) => position.id === applicant.positionId)?.name}</p>
        );
      case "location":
        return (
          <p className="text-bold text-sm capitalize">{applicant.countryCode ? LOCATION_LOOKUP[applicant.countryCode] : "Unknown"}</p>
        );
      case "stars":
        const applicantStars = applicant.stars;
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
        const applicantStatus = applicant.status;
        return (
          <Chip className="capitalize" color={getApplicantStatusColor(applicantStatus)} size="sm" variant="solid">
            {(applicantStatus === "newApply") ? "new" : applicantStatus}
          </Chip>
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
                  if (applicantCard.display && applicantID === applicantCard.id) {
                    setApplicantCard((prev) => ({display: false}));
                  }
                  setTableLoading(() => {return {status: true, color: "danger", text: "Deleting Applicant..."};});
                  await fetch(`/api/console/delete-applicants`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({applicants: [{id: applicantID, positionId: applicant.positionId}]}),
                  });

                  setApplicants((prev) => {return prev.filter((triplet) => triplet.id !== applicantID);});
                  setTableLoading((prev) => {return {...prev, status: false};});
                }}
              >
                <span className="text-lg text-danger-400 cursor-pointer active:opacity-50">
                  <DeleteOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
            <Tooltip content="View Resume" color={"default"} delay={400} closeDelay={600}>
              <Button isIconOnly isExternal as={Link} href={applicant.resumeInfo.uploadthing.url} variant="light" aria-label="View Resume" size="sm">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <InsertDriveFileOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return "?";
    }
  }, [setApplicants, setTableLoading, applicantCard, setApplicantCard, positions]);

  const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setTablePage(1);
  }, [setTablePage, setRowsPerPage]);

  const handleRowAction = useCallback(async (key: Key) => {
    const applicant = applicants.find((applicant) => applicant.id === key);
    if (!applicant) {
      return;
    }
    if (applicantCard.display && key === applicantCard.id) {
      await fetch(`/api/console/set-applicant-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: key, notes: applicant?.applicantInfo.notes}),
      });
    }
    setApplicantCard((prev) => ({display: true, ...applicant}));
  }, [applicants, applicantCard, setApplicantCard]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <Tooltip content="Delete Selected Applicants" color={"danger"} delay={400} closeDelay={600}>
            <Button isIconOnly variant="light" aria-label="Delete Applicant" size="sm"
              onPress={async () => {
                if (selectedKeys === undefined) {
                  return;
                }
                if (selectedKeys !== "all" && (new Set(selectedKeys)).size === 0) {
                  return;
                }
                if (applicantCard.display && (selectedKeys === "all" || (new Set(selectedKeys)).has(applicantCard.id))) {  
                  setApplicantCard((prev) => ({display: false}));
                }
                setTableLoading((prev) => {return {status: true, color: "danger", text: "Deleting Selected Applicants..."};});
                await fetch(`/api/console/delete-applicants`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({applicants: (selectedKeys === "all" ? applicants.map((applicant) => ({id: applicant.id, positionId: applicant.positionId})) : applicants.filter((applicant) => (new Set(selectedKeys)).has(applicant.id)).map((applicant) => ({id: applicant.id, positionId: applicant.positionId})))}),
                });
                setApplicants((prev) => prev.filter((triplet) => (selectedKeys === "all" ? false : !(new Set(selectedKeys)).has(triplet.id))));
                setSelectedKeys(new Set([]));
                setTableLoading((prev) => ({...prev, status: false}));
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
                        if (!keys || keys === "all" || keys.size !== 1 || selectedKeys === undefined || (selectedKeys !== "all" && (new Set(selectedKeys).size === 0))) {
                          return;
                        }
                        const newKey = Array.from(keys)[0];
                        if (!isApplicantStatus(newKey)) {
                          return;
                        }
                        let newSelectedKeys: Key[] = [];
                        if (selectedKeys === "all") {
                          newSelectedKeys = applicants.map((applicant) => applicant.id);
                        } else {
                          newSelectedKeys = Array.from(selectedKeys);
                        }

                        const res = await fetch(`/api/console/update-applicants-metadata`, {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({applicants: applicants.filter(
                              (applicant) => newSelectedKeys.includes(applicant.id)
                            ).map(
                              (applicant) => ({id: applicant.id, positionId: applicant.positionId, metadata: {
                                countryCode: applicant.countryCode,
                                stars: applicant.stars,
                                status: newKey,
                                notes: applicant.applicantInfo.notes,
                                yoe: applicant.yoe,
                            }})
                            )}),
                          });
                        if (!res.ok) {
                            alert("Failed to update applicant status.");
                            return;
                        }
                        setApplicants((prev) => {
                            return prev.map((triplet) => {
                              if (newSelectedKeys.includes(triplet.id)) {
                                return {...triplet, status: newKey};
                              }
                              return triplet;
                            });
                        });
                    }
                }
            >
                {APPLICANT_STATUS_OPTIONS.map((key) => 
                    <DropdownItem key={key} textValue={key === "newApply" ? "new" : key}>
                        <Chip className="capitalize" color={getApplicantStatusColor(key)} size="sm" variant="solid">
                            {key === "newApply" ? "New" : key}
                        </Chip>
                    </DropdownItem>
                )}
            </DropdownMenu>
          </Dropdown>
          {
            applicants.length > 0
            ?
                <CSVLink data={applicants.map((applicant) => {
                  return {
                    ID: applicant.id,
                    SCORE: Math.round(applicant.score * 100),
                    NAME: applicant.applicantInfo.name,
                    POSITION: positions.find((position) => position.id === applicant.positionId)?.name,
                    LOCATION: applicant.countryCode ? LOCATION_LOOKUP[applicant.countryCode] : "Unknown",
                    STATUS: applicant.status === "newApply" ? "New" : capitalize(applicant.status),
                    STARS: applicant.stars,
                  };
                })} className="text-success ml-1" filename={"applicants.csv"}>CSV</CSVLink>
            :
                <div className="text-success ml-1">CSV</div>
          }
          <span className="whitespace-nowrap w-[30%] text-small text-default-40 ml-2">
            {selectedKeys === "all"
              ? "All items selected"
              : (selectedKeys === undefined 
                ? "No items selected"
                : `${(new Set(selectedKeys)).size} of ${filteredItems.length} items`
              ) }
          </span>
        </div>
        <div className="flex-[3_1_0%] flex justify-center items-center w-full">
          <Pagination
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
  }, [setApplicants, setTableLoading, onRowsPerPageChange, selectedKeys, tablePage, pages, filteredItems, setTablePage, setSelectedKeys, applicants, applicantCard, setApplicantCard, positions]);

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      radius="md"
      bottomContent={bottomContent}
      bottomContentPlacement="inside"
      className="h-full w-full"
      classNames={{
        wrapper: "flex-auto w-full",
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      onRowAction={handleRowAction}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
            className = {column.uid === "actions" ? "text-end pr-unit-10" : undefined}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={(tableLoading.status ? " " : "Run a query to find applicants...")} items={sortedItems} isLoading={tableLoading.status} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label={tableLoading.text} color={isNextUIColor(tableLoading.color) ? tableLoading.color : "default"} labelColor={isNextUIColor(tableLoading.color) ? (tableLoading.color === "default" ? "foreground" : tableLoading.color) : "foreground"} size="lg" />}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
