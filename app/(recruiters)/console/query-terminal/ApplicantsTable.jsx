"use client";

import React, { useEffect } from "react";

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import {  Table,  TableHeader,  TableBody,  TableColumn,  TableRow,  TableCell} from "@nextui-org/table";
import {Spinner} from "@nextui-org/spinner";
import {Button} from "@nextui-org/button";
import {Link} from "@nextui-org/link";
import {Chip} from "@nextui-org/chip";
import {Tooltip} from "@nextui-org/tooltip";
import {Pagination} from "@nextui-org/pagination";

import {capitalize} from "@/app/utils/utils";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';

import { locations, locationLookup } from "@/app/utils/locations";

import { CSVLink } from "react-csv";

const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "SCORE", uid: "score", sortable: true},
  {name: "NAME", uid: "name", sortable: true},
  {name: "AGE", uid: "age", sortable: true},
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

export default function ApplicantsTable({
  applicants,
  setApplicants,
  tableLoading,
  setTableLoading,
  cardState,
  setCardState,
  selectedKeys,
  setSelectedKeys,
  rowsPerPage,
  setRowsPerPage,
  sortDescriptor,
  setSortDescriptor,
  tablePage,
  setTablePage,
}) {
  const cardIDRef = React.useRef(cardState.id);
  cardIDRef.current = cardState.id;

  const headerColumns = React.useMemo(() => {
    return columns.filter((column) => ["score", "name", "position", "location", "stars", "status", "actions"].includes(column.uid));
  }, []);

  const filteredItems = React.useMemo(() => {
    let filteredApplicants = [...applicants];
    return filteredApplicants;
  }, [applicants]);
  
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
    const applicantDoc = applicant.applicantDoc;
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
          <p className="text-bold text-sm capitalize">{applicantDoc.name}</p>
        );
      case "position":
        return (
          <p className="text-bold text-sm capitalize">{applicantDoc.position}</p>
        );
      case "location":
        return (
          <p className="text-bold text-sm capitalize">{locationLookup[applicantDoc.countryCode]}</p>
        );
      case "stars":
        const applicantStars = applicantDoc.stars;
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
        const applicantStatus = applicantDoc.status;
        return (
          <Chip className="capitalize" color={statusColorMap[applicantStatus]} size="sm" variant="solid">
            {(applicantStatus === "newApply") ? "new" : applicantStatus}
          </Chip>
        );
      case "age":
        return (
          <p className="text-bold text-sm capitalize">{applicantDoc.age}</p>
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
                    if (applicantDoc && applicantDoc.notes) {
                      await fetch(`/api/set-applicant-notes`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({id: applicantID, notes: applicantDoc.notes}),
                      });
                    }
                    setCardState((prev) => ({...prev, display: false}));
                  }
                  setTableLoading(() => {return {status: true, color: "danger", text: "Deleting Applicant..."};});
                  await fetch(`/api/delete-applicants`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ids: [applicantID]}),
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
              <Button isIconOnly isExternal as={Link} href={applicantDoc.resumeUrl} variant="light" aria-label="View Resume" size="sm">
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
  }, [setApplicants, setTableLoading, setCardState, cardIDRef]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setTablePage(1);
  }, [setTablePage, setRowsPerPage]);

  const handleRowAction = React.useCallback(async (key) => {
    const applicant = applicants.find((applicant) => applicant.id === key);
    if (cardState.doc && cardState.doc.notes) {
      await fetch(`/api/set-applicant-notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({id: cardState.id, notes: cardState.doc.notes}),
      });
    }
    setCardState((prev) => ({display: true, id: key, score: applicant.score, doc: applicant.applicantDoc}));
  }, [applicants, cardState, setCardState]);

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
                  const cardApplicant = applicants.find((applicant) => applicant.id === cardIDRef.current);
                  if (cardApplicant.doc && cardApplicant.doc.notes) {
                    await fetch(`/api/set-applicant-notes`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({id: cardApplicant.id, notes: cardApplicant.doc.notes}),
                    });
                  }
                  setCardState((prev) => ({...prev, display: false}));
                }
                setTableLoading((prev) => {return {status: true, color: "danger", text: "Deleting Selected Applicants..."};});
                await fetch(`/api/delete-applicants`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ids: (selectedKeys === "all" ? applicantIDs.map((i) => i.id) : [...selectedKeys])}),
                });
                setApplicants((prev) => prev.filter((triplet) => (selectedKeys === "all" ? false : !selectedKeys.has(triplet.id))));
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
                        
                        setApplicants((prev) => {
                            return prev.map((triplet) => {
                              if (newSelectedKeys.includes(triplet.id)) {
                                return {...triplet, applicantDoc: {...triplet.applicantDoc, status: newKey}};
                              }
                              return triplet;
                            });
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
          {
            applicants.length > 0
            ?
                <CSVLink data={applicants.map((applicant) => {
                  return {
                    ID: applicant.id,
                    SCORE: Math.round(applicant.score * 100),
                    NAME: applicant.applicantDoc.name,
                    POSITION: applicant.applicantDoc.position,
                    LOCATION: locationLookup[applicant.applicantDoc.countryCode],
                    STATUS: applicant.applicantDoc.status === "newApply" ? "New" : capitalize(applicant.applicantDoc.status),
                    STARS: applicant.applicantDoc.stars,
                  };
                })} className="text-success ml-1" filename={"applicants.csv"}>CSV</CSVLink>
            :
                <div className="text-success ml-1">CSV</div>
          }
          <span className="whitespace-nowrap w-[30%] text-small text-default-40 w-full ml-2">
            {selectedKeys === "all"
              ? "All items selected"
              : `${selectedKeys.size} of ${filteredItems.length} items`}
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
  }, [setApplicants, setTableLoading, onRowsPerPageChange, selectedKeys, tablePage, pages, filteredItems, cardIDRef, setCardState, setTablePage, setSelectedKeys, applicants]);

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
            className = {column.uid === "actions" ? "text-end pr-unit-10" : null}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={(tableLoading.status ? " " : "Run a query to find applicants...")} items={sortedItems} isLoading={tableLoading.status} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label={tableLoading.text} color={tableLoading.color} labelColor={tableLoading.color} size="lg" />}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
