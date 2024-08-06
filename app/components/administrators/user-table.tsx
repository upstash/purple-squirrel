"use client";

import { useMemo, useCallback, Key } from "react";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
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

import { ChevronDownIcon } from "@/app/utils/chevron-down-icon";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";

import { useAdmin } from "@/app/managers";
import type { User } from "@clerk/backend";

import { ROLE_COLOR_MAP } from "@/app/constants";
import { getRoleColor } from "@/app/utils";
import { isRole } from "@/types/validations";
import type { Role } from "@/types";

import { capitalize } from "@/app/utils";

const columns = [
  { name: "NAME", uid: "name", sortable: true },
  { name: "EMAIL", uid: "email", sortable: true },
  { name: "ROLE", uid: "role" },
  { name: "ACTIONS", uid: "actions" },
];

const roleOptions = [
  { name: "User", uid: "user" },
  { name: "Recruiter", uid: "recruiter" },
  { name: "Admin", uid: "admin" },
];

const roleSet = new Set(roleOptions.map((role) => role.uid));
roleSet.delete("All");

const roleArray = Object.keys(ROLE_COLOR_MAP);

const eqSet = (xs: Set<any>, ys: Set<any>) =>
  xs.size === ys.size && Array.from(xs).every((x) => ys.has(x));

const inSet = (xs: Set<any>, ys: Set<any>) =>
  Array.from(xs).every((x) => ys.has(x));

export function UserTable() {
  const {
    users,
    setUsers,
    usersLoading,
    setUsersLoading,
    userSearchText,
    setUserSearchText,
    roleFilter,
    setRoleFilter,
    userRowsPerPage,
    setUserRowsPerPage,
    userTablePage,
    setUserTablePage,
    selectedUserKeys,
    setSelectedUserKeys,
  } = useAdmin();

  const headerColumns = columns;

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (
      roleFilter !== "all" &&
      Array.from(roleFilter).length !== roleOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        user.publicMetadata.role
          ? (user.publicMetadata.role === "user" &&
              Array.from(roleFilter).includes("User")) ||
            (user.publicMetadata.role === "recruiter" &&
              Array.from(roleFilter).includes("Recruiter")) ||
            (user.publicMetadata.role === "admin" &&
              Array.from(roleFilter).includes("Admin"))
          : Array.from(roleFilter).includes("User")
      );
    }
    return filteredUsers;
  }, [users, roleFilter]);

  const pages = Math.ceil(filteredItems.length / userRowsPerPage);

  const items = useMemo(() => {
    const start = (userTablePage - 1) * userRowsPerPage;
    const end = start + userRowsPerPage;

    return filteredItems.slice(start, end);
  }, [userTablePage, filteredItems, userRowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items];
  }, [items]);

  const renderCell = useCallback(
    (user: User, columnKey: Key) => {
      switch (columnKey) {
        case "name":
          const firstName = user.firstName || null;
          const lastName = user.lastName || null;
          if (!firstName && !lastName) {
            return <p className="text-bold text-sm">Unknown</p>;
          }
          return (
            <p className="text-bold text-sm capitalize">{`${firstName || ""} ${
              lastName || ""
            }`}</p>
          );
        case "email":
          return (
            <p className="text-bold text-sm">
              {user.emailAddresses[0].emailAddress}
            </p>
          );
        case "role":
          const userRole =
            (user.publicMetadata.role as Role) || undefined || "user";
          return (
            <Dropdown className="min-w-0 w-fit">
              <DropdownTrigger>
                <button>
                  <Chip
                    className="capitalize"
                    color={
                      isRole(userRole) ? getRoleColor(userRole) : "default"
                    }
                    size="sm"
                    variant="solid"
                    endContent={<ArrowDropDownOutlinedIcon />}
                  >
                    {userRole}
                  </Chip>
                </button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={new Set([userRole])}
                className="min-w-0 w-fit"
                onSelectionChange={async (keys) => {
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
                    body: JSON.stringify({ id: user.id, role: chosenRole }),
                  });
                  if (res.status !== 200) {
                    console.error("Failed to set user role");
                    return;
                  } else {
                    setUsers((prev: User[]) => {
                      return prev.map((u) => {
                        if (u.id === user.id && u.publicMetadata) {
                          return {
                            ...u,
                            publicMetadata: {
                              ...u.publicMetadata,
                              role: chosenRole,
                            },
                          } as unknown as User;
                        }
                        return u;
                      });
                    });
                  }
                }}
              >
                {roleArray.map((role) => (
                  <DropdownItem key={role} textValue={role}>
                    <Chip
                      className="capitalize"
                      color={isRole(role) ? getRoleColor(role) : "default"}
                      size="sm"
                      variant="solid"
                    >
                      {role}
                    </Chip>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          );
        case "actions":
          return (
            <Tooltip
              content="Delete Applicant"
              color={"danger"}
              delay={400}
              closeDelay={600}
            >
              <Button
                isIconOnly
                variant="light"
                aria-label="Delete Applicant"
                size="sm"
                onPress={async () => {
                  setUsersLoading(true);
                  const res = await fetch(`/api/users/delete-users`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ids: [user.id] }),
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
                <span
                  className={
                    "text-lg text-danger-400 cursor-pointer active:opacity-50"
                  }
                >
                  <DeleteOutlinedIcon />
                </span>
              </Button>
            </Tooltip>
          );
        default:
          return "?";
      }
    },
    [setUsers, setUsersLoading]
  );

  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setUserRowsPerPage(Number(e.target.value));
      setUserTablePage(1);
    },
    [setUserTablePage, setUserRowsPerPage]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-2 items-end">
          <div className="flex-auto w-full">
            <Input
              size="sm"
              radius="md"
              placeholder="Search for a user..."
              value={userSearchText}
              onValueChange={(value) =>
                setUserSearchText((prev) => {
                  return value;
                })
              }
              classNames={{ inputWrapper: "h-unit-10 bg-default-100" }}
              onKeyUp={async (e) => {
                if (e.key === "Enter") {
                  setUsersLoading(true);
                  const res = await fetch(`/api/users/get-users`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ query: userSearchText }),
                  });
                  const resdata = await res.json();
                  setUsers(resdata.users);
                  setUsersLoading(false);
                }
              }}
            />
          </div>
          <div className="flex-initial">
            <Button
              color="secondary"
              size="md"
              radius="md"
              onPress={async () => {
                setUsersLoading(true);
                const res = await fetch(`/api/users/get-users`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ query: userSearchText }),
                });
                const resdata = await res.json();
                setUsers(resdata.users);
                setUsersLoading(false);
              }}
            >
              Search
            </Button>
          </div>
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                  color={
                    roleFilter === "all" || inSet(roleSet, roleFilter)
                      ? "default"
                      : "secondary"
                  }
                >
                  Role
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={roleFilter}
                selectionMode="multiple"
                onSelectionChange={(keys) => {}}
              >
                {roleOptions.map((role) => (
                  <DropdownItem
                    key={role.uid}
                    className={
                      role.uid === "All"
                        ? "capitalize text-danger"
                        : "capitalize"
                    }
                    variant="bordered"
                  >
                    {
                      <Chip
                        color={
                          isRole(role.uid) ? getRoleColor(role.uid) : "default"
                        }
                        size="sm"
                      >
                        {capitalize(role.name)}
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
  }, [
    setUsers,
    setUsersLoading,
    roleFilter,
    userSearchText,
    setUserSearchText,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <Tooltip
            content="Delete Selected Users"
            color={"danger"}
            delay={400}
            closeDelay={600}
          >
            <Button
              isIconOnly
              variant="light"
              aria-label="Delete Applicant"
              size="sm"
              onPress={async () => {
                if (
                  !selectedUserKeys ||
                  (selectedUserKeys !== "all" &&
                    new Set(selectedUserKeys).size === 0)
                ) {
                  return;
                }
                setUsersLoading(true);
                const res = await fetch(`/api/users/delete-users`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ids: Array.from(selectedUserKeys) }),
                });
                if (res.status !== 200) {
                  console.error("Failed to delete user");
                  return;
                } else {
                  setUsers((prev) => {
                    return prev.filter(
                      (u) => !new Set(selectedUserKeys).has(u.id)
                    );
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
              <Button
                isIconOnly
                variant="light"
                aria-label="Change Applicants Status"
                size="sm"
              >
                <Tooltip
                  content="Change Roles of Selected Users"
                  color={"warning"}
                  delay={400}
                  closeDelay={600}
                >
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
              selectedKeys={new Set([])}
              className="min-w-0 w-fit"
              onSelectionChange={async (keys) => {
                if (
                  !keys ||
                  keys === "all" ||
                  keys.size !== 1 ||
                  !selectedUserKeys ||
                  new Set(selectedUserKeys).size === 0
                ) {
                  return;
                }
                const chosenRole = Array.from(keys)[0];
                if (!isRole(chosenRole)) {
                  return;
                }
                setUsersLoading(true);
                let changeIds =
                  selectedUserKeys === "all"
                    ? users.map((u) => u.id)
                    : Array.from(selectedUserKeys);

                const res = await fetch(`/api/users/set-users-role`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ ids: changeIds, role: chosenRole }),
                });
                if (res.status !== 200) {
                  console.error("Failed to set user role");
                  return;
                } else {
                  setUsers((prev) => {
                    return prev.map((u) => {
                      if (
                        selectedUserKeys === "all" ||
                        new Set(selectedUserKeys).has(u.id)
                      ) {
                        return {
                          ...u,
                          publicMetadata: {
                            ...u.publicMetadata,
                            role: chosenRole,
                          },
                        } as unknown as User;
                      }
                      return u;
                    });
                  });
                }
                setUsersLoading(false);
              }}
            >
              {roleArray.map((key) => (
                <DropdownItem key={key} textValue={key}>
                  <Chip
                    className="capitalize"
                    color={isRole(key) ? getRoleColor(key) : "default"}
                    size="sm"
                    variant="solid"
                  >
                    {key}
                  </Chip>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <span className="whitespace-nowrap w-[30%] text-small text-default-40 ml-2">
            {selectedUserKeys === "all"
              ? "All items selected"
              : selectedUserKeys === undefined
              ? "No items selected"
              : `${new Set(selectedUserKeys).size} of ${
                  filteredItems.length
                } items`}
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
  }, [
    onRowsPerPageChange,
    selectedUserKeys,
    userTablePage,
    pages,
    filteredItems,
    setUserTablePage,
    setUsers,
    setUsersLoading,
    users,
    setSelectedUserKeys,
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
      selectedKeys={selectedUserKeys}
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
      <TableBody
        emptyContent={usersLoading ? " " : "Run a query to find users..."}
        items={sortedItems}
        isLoading={usersLoading}
        loadingContent={
          <Spinner
            className="h-full w-full bg-default-50/75"
            label="Searching Users..."
            color="secondary"
            labelColor={"secondary"}
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
