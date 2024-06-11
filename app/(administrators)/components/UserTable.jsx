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
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

import { clerkClient } from "@clerk/nextjs/server";


const columns = [
  {name: "NAME", uid: "name", sortable: true},
  {name: "EMAIL", uid: "email", sortable: true},
  {name: "ROLE", uid: "role"},
  {name: "ACTIONS", uid: "actions"},
];

const roleOptions = [
    {name: "All", uid: "All"},
    {name: "User", uid: "user"},
    {name: "Recruiter", uid: "recruiter"},
    {name: "Admin", uid: "admin"},
];

const roleSet = new Set(roleOptions.map((role) => role.uid));
roleSet.delete("All");

const roleColorMap = {
    user: "default",
    recruiter: "secondary",
    admin: "danger"
};

const roleArray = Object.keys(roleColorMap);

const eqSet = (xs, ys) =>
    xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));

const inSet = (xs, ys) =>
    [...xs].every((x) => ys.has(x));


export default function Users({
    users,
    setUsers,
    userSearchText,
    setUserSearchText,
    usersLoading,
    setUsersLoading,
    roleFilter,
    setRoleFilter,
    userRowsPerPage,
    setUserRowsPerPage,
    userTablePage,
    setUserTablePage,
    selectedUserKeys,
    setSelectedUserKeys,
}) {

  const headerColumns = columns;

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users];

    if (roleFilter !== "all" && Array.from(roleFilter).length !== roleOptions.length) {
        filteredUsers = filteredUsers.filter((user) =>
        Array.from(roleFilter).includes(user.publicMetadata.role),
      );
    }
    return filteredUsers;
  }, [users, roleFilter]);
  
  const pages = Math.ceil(filteredItems.length / userRowsPerPage);

  const items = React.useMemo(() => {
    const start = (userTablePage - 1) * userRowsPerPage;
    const end = start + userRowsPerPage;

    return filteredItems.slice(start, end);
  }, [userTablePage, filteredItems, userRowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items]
  }, [items]);

  const renderCell = React.useCallback((user, columnKey) => {
    switch (columnKey) {
      case "name":
        const firstName = user.firstName || null;
        const lastName = user.lastName || null;
        if (!firstName && !lastName) {
          return (
            <p className="text-bold text-sm">Unknown</p>
          );
        }
        return (
          <p className="text-bold text-sm capitalize">{`${firstName || ""} ${lastName || ""}`}</p>
        );
        case "email":
            return (
              <p className="text-bold text-sm">{user.emailAddresses[0].emailAddress}</p>
            );
      case "role":
        const userRole = user.publicMetadata.role || "user";
        return (
            <Dropdown className="min-w-0 w-fit">
                <DropdownTrigger>
                    <button>
                        <Chip className="capitalize" color={roleColorMap[userRole]} size="sm" variant="solid" endContent={<ArrowDropDownOutlinedIcon/>}>
                            {userRole}
                        </Chip>
                    </button>
                </DropdownTrigger>
                <DropdownMenu 
                    aria-label="Single selection example"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="single"
                    selectedUserKeys={new Set([userRole])}
                    className="min-w-0 w-fit"
                    onSelectionChange={
                        async (keys) => {
                            console.log(keys);
                            const chosenRole = Array.from(keys)[0];
                            if (chosenRole === userRole) {
                                return;
                            }
                            const res = await fetch(`/api/users/set-user-role`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({id: user.id, role: chosenRole}),
                            });
                            if (res.status !== 200) {
                                console.error("Failed to set user role");
                                return;
                            } else {
                              setUsers((prev) => {
                                  return prev.map((u) => {
                                      if (u.id === user.id) {
                                          return {...u, publicMetadata: {...u.publicMetadata, role: chosenRole}};
                                      }
                                      return u;
                                  });
                              });
                            }
                        }
                    }
                >
                    {roleArray.map((role) => 
                        <DropdownItem key={role} textValue={role}>
                            <Chip className="capitalize" color={roleColorMap[role]} size="sm" variant="solid">
                                {role}
                            </Chip>
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        );
      case "actions":
        return (
            <Tooltip content="Delete Applicant" color={"danger"} delay={400} closeDelay={600}>
              <Button isIconOnly variant="light" aria-label="Delete Applicant" size="sm"
                onPress={async () => {
                  setUsersLoading(true);
                  const res = await fetch(`/api/users/delete-users`, {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ids: [user.id]}),
                  });
                  if (res.status !== 200) {
                    console.error("Failed to delete user");
                    return;
                  } else {
                    setUsers((prev) => {
                        return prev.filter((u) => u.id !== user.id);
                    });
                  }
                  setUsersLoading(false);
                }}
              >
                <span className={"text-lg text-danger-400 cursor-pointer active:opacity-50"}>
                  <DeleteOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
        );
      default:
        return "?";
    }
  }, [setUsers, setUsersLoading]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setUserRowsPerPage(Number(e.target.value));
    setUserTablePage(1);
  }, [setUserTablePage, setUserRowsPerPage]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-2 items-end">
            <div className="flex-auto w-full">
                <Input size="sm" radius="md" placeholder="Search for a user..." value={userSearchText} onValueChange={(value) => setUserSearchText((prev) => {return value;})} classNames={{inputWrapper: "h-unit-10 bg-default-100"}} 
                  onKeyUp={async (e) => {
                    if (e.key === "Enter") {
                      setUsersLoading(true);
                      const res = await fetch(`/api/users/get-users`, {
                          method: "POST",
                          headers: {
                              "Content-Type": "application/json",
                          },
                          body: JSON.stringify({query: userSearchText}),
                      });
                      const resdata = await res.json();
                      setUsers(resdata.users);
                      setUsersLoading(false);
                    }
                  }}
                />
            </div>
            <div className="flex-initial">
                <Button color="secondary" size="md" radius="md" onPress={
                    async () => {
                        setUsersLoading(true);
                        const res = await fetch(`/api/users/get-users`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({query: userSearchText}),
                        });
                        const resdata = await res.json();
                        setUsers(resdata.users);
                        setUsersLoading(false);
                    }
                }>
                    Search
                </Button>
            </div>
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat" color={roleFilter === "all" || inSet(roleSet, roleFilter) ? "default" : "secondary"}>
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => {
                  if (roleFilter === "all") {
                    if (!keys.has("All")) {
                      setRoleFilter((prev) => (new Set([])));
                      return;
                    } else {
                      keys.delete("All");
                      setRoleFilter((prev) => (keys));
                      return;
                    }
                  }
                  if (roleFilter.has("All")) {
                    if (!keys.has("All")) {
                      setRoleFilter((prev) => (new Set([])));
                      return;
                    } else {
                      keys.delete("All");
                      setRoleFilter((prev) => (keys));
                      return;
                    }
                  }
                  if (keys.has("All")) {
                    setRoleFilter((prev) => {
                      const newStatusSet = new Set(roleSet);
                      newStatusSet.add("All");
                      return newStatusSet;
                    });
                    return;
                  } else {
                    if (eqSet(keys, roleSet)) {
                      keys.add("All");
                    }
                    setRoleFilter((prev) => (keys));
                    return;
                  }
                }}
              >
                {roleOptions.map((role) => (
                  <DropdownItem key={role.uid} className={role.uid === "All" ? "capitalize text-danger" : "capitalize"} variant="bordered">
                    {(role.uid === "All") ? (roleFilter === "all" || roleFilter.has("All") ? "Deselect All" : "Select All") : <Chip color={roleColorMap[role.uid]} size="sm">{capitalize(role.name)}</Chip>}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }, [
    setUsers,
    setUsersLoading,
    roleFilter,
    setRoleFilter,
    userSearchText,
    setUserSearchText,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <Tooltip content="Delete Selected Users" color={"danger"} delay={400} closeDelay={600}>
            <Button isIconOnly variant="light" aria-label="Delete Applicant" size="sm"
              onPress={async () => {
                if (selectedUserKeys.size === 0) {
                  return;
                }
                setUsersLoading(true);
                const res = await fetch(`/api/users/delete-users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ids: Array.from(selectedUserKeys)}),
                });
                if (res.status !== 200) {
                  console.error("Failed to delete user");
                  return;
                } else {
                  setUsers((prev) => {
                      return prev.filter((u) => !selectedUserKeys.has(u.id));
                  });
                  setSelectedUserKeys(new Set([]));
                }
                setUsersLoading(false);
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
                  <Tooltip content="Change Roles of Selected Users" color={"warning"} delay={400} closeDelay={600}>
                    <span className="text-warning-400 cursor-pointer active:opacity-50">
                      <AdminPanelSettingsOutlinedIcon />
                    </span>
                  </Tooltip>
                </Button>
            </DropdownTrigger>
            <DropdownMenu 
                aria-label="Single selection example"
                variant="flat"
                selectionMode="single"
                selectedUserKeys={new Set([])}
                className="min-w-0 w-fit"
                onSelectionChange={
                    async (keys) => {
                        if (!keys || keys.size !== 1 || !selectedUserKeys || selectedUserKeys.size === 0) {
                            return;
                        }
                        setUsersLoading(true);
                        const chosenRole = Array.from(keys)[0];
                        let changeIds = (selectedUserKeys === "all") ? users.map((u) => u.id) : Array.from(selectedUserKeys)

                        const res = await fetch(`/api/users/set-users-role`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ids: changeIds, role: chosenRole}),
                        });
                        if (res.status !== 200) {
                            console.error("Failed to set user role");
                            return;
                        } else {
                          setUsers((prev) => {
                              return prev.map((u) => {
                                  if (selectedUserKeys === "all" || selectedUserKeys.has(u.id)) {
                                    return {...u, publicMetadata: {...u.publicMetadata, role: chosenRole}};
                                  }
                                  return u;
                              });
                          });
                        }
                        setUsersLoading(false);
                    }
                }
            >
                {roleArray.map((key) => 
                    <DropdownItem key={key} textValue={key === "newApply" ? "new" : key}>
                        <Chip className="capitalize" color={roleColorMap[key]} size="sm" variant="solid">
                            {key === "newApply" ? "New" : key}
                        </Chip>
                    </DropdownItem>
                )}
            </DropdownMenu>
          </Dropdown>
          <span className="whitespace-nowrap w-[30%] text-small text-default-40 w-full ml-2">
            {selectedUserKeys === "all"
              ? "All items selected"
              : `${selectedUserKeys.size} of ${filteredItems.length} items`}
          </span>
        </div>
        <div className="flex-[3_1_0%] flex justify-center items-center w-full">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={userTablePage}
            total={pages}
            onChange={setUserTablePage}
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
  }, [onRowsPerPageChange, selectedUserKeys, userTablePage, pages, filteredItems, setUserTablePage, setUsers, setUsersLoading, users, setSelectedUserKeys]);

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
      selectedUserKeys={selectedUserKeys}
      selectionMode="multiple"
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedUserKeys}
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
      <TableBody emptyContent={(usersLoading ? " " : "Run a query to find users...")} items={sortedItems} isLoading={usersLoading} loadingContent={<Spinner className="h-full w-full bg-default-50/75" label="Searching Users..." color="secondary" labelColor={"secondary"} size="lg" />}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
