import { createContext, useContext, useState } from "react"
import { Key } from "@react-types/shared";
import { v4 as uuidv4 } from "uuid";
import { User } from "@clerk/backend"

import type { Query, Position, QueryTerminalSettingsTab, ApplicantCard, Applicant, SearchSettings, ApplicantRow, Scheduling } from "@/types";

type AdminConsole = {
    positions: Position[];
    setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
    positionsLoading: boolean;
    setPositionsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    positionOpenText: string;
    setPositionOpenText: React.Dispatch<React.SetStateAction<string>>;
    positionSearchText: string;
    setPositionSearchText: React.Dispatch<React.SetStateAction<string>>;
    statusFilter: "all" | Set<"Open" | "Closed">;
    setStatusFilter: React.Dispatch<React.SetStateAction<"all" | Set<"Open" | "Closed">>>;
    rowsPerPage: number;
    setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
    tablePage: number;
    setTablePage: React.Dispatch<React.SetStateAction<number>>;
    selectedKeys: "all" | Iterable<Key> | undefined;
    setSelectedKeys: React.Dispatch<React.SetStateAction<"all" | Iterable<Key> | undefined>>;
    scheduling: Scheduling | {};
    setScheduling: React.Dispatch<React.SetStateAction<Scheduling | {}>>;
    schedulingLoading: boolean;
    setSchedulingLoading: React.Dispatch<React.SetStateAction<boolean>>;
    methodsSelected: string[];
    setMethodsSelected: React.Dispatch<React.SetStateAction<string[]>>;
    methodSaved: boolean;
    setMethodSaved: React.Dispatch<React.SetStateAction<boolean>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    userSearchText: string;
    setUserSearchText: React.Dispatch<React.SetStateAction<string>>;
    usersLoading: boolean;
    setUsersLoading: React.Dispatch<React.SetStateAction<boolean>>;
    roleFilter: "all" | Set<"Admin" | "User" | "Recruiter">;
    setRoleFilter: React.Dispatch<React.SetStateAction<"all" | Set<"Admin" | "User" | "Recruiter">>>;
    userRowsPerPage: number;
    setUserRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
    userTablePage: number;
    setUserTablePage: React.Dispatch<React.SetStateAction<number>>;
    selectedUserKeys: "all" | Iterable<Key> | undefined;
    setSelectedUserKeys: React.Dispatch<React.SetStateAction<"all" | Iterable<Key> | undefined>>;
}

const AdminContext = createContext<AdminConsole | undefined>(undefined)

const AdminProvider = AdminContext.Provider

export const useAdmin = () => {
  const context = useContext(AdminContext)

  if (!context) throw new Error("use useAdmin within a AdminProvider")

  return context
}

export const AdminManager = ({ children }: { children: React.ReactNode }) => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [positionsLoading, setPositionsLoading] = useState<boolean>(true);
    const [positionOpenText, setPositionOpenText] = useState<string>("");
    const [positionSearchText, setPositionSearchText] = useState<string>("");

    const [statusFilter, setStatusFilter] = useState<"all" | Set<"Open" | "Closed">>("all");
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [tablePage, setTablePage] = useState<number>(1);
    const [selectedKeys, setSelectedKeys] = useState<"all" | Iterable<Key> | undefined>(new Set([]));

    const [scheduling, setScheduling] = useState<Scheduling | {}>({});

    const [schedulingLoading, setSchedulingLoading] = useState<boolean>(true);

    const [methodsSelected, setMethodsSelected] = useState(["mail", "ps"]);

    const [methodSaved, setMethodSaved] = useState<boolean>(false);

    const [users, setUsers] = useState<User[]>([]);
    const [userSearchText, setUserSearchText] = useState<string>("");
    const [usersLoading, setUsersLoading] = useState<boolean>(false);
    const [roleFilter, setRoleFilter] = useState<"all" | Set<"Admin" | "User" | "Recruiter">>("all");
    const [userRowsPerPage, setUserRowsPerPage] = useState<number>(10);
    const [userTablePage, setUserTablePage] = useState<number>(1);
    const [selectedUserKeys, setSelectedUserKeys] = useState<"all" | Iterable<Key> | undefined>(new Set([]));
    return (
        <AdminProvider
        value={{
            positions,
            setPositions,
            positionsLoading,
            setPositionsLoading,
            positionOpenText,
            setPositionOpenText,
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
            scheduling,
            setScheduling,
            schedulingLoading,
            setSchedulingLoading,
            methodsSelected,
            setMethodsSelected,
            methodSaved,
            setMethodSaved,
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
            setSelectedUserKeys
        }}
        >
            {children}
        </AdminProvider>
        )
    }
