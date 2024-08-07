import { createContext, useContext, useState } from "react";
import { SortDescriptor, Key } from "@react-types/shared";
import { v4 as uuidv4 } from "uuid";

import type {
  Query,
  Position,
  QueryTerminalSettingsTab,
  ApplicantCard,
  SearchSettings,
  ApplicantRow,
  Applicant,
} from "@/types";

type QueryTerminal = {
  applicants: ApplicantRow[];
  setApplicants: React.Dispatch<React.SetStateAction<ApplicantRow[]>>;
  query: Query;
  setQuery: React.Dispatch<React.SetStateAction<Query>>;
  tableLoading: { status: boolean; color: string; text: string };
  setTableLoading: React.Dispatch<
    React.SetStateAction<{ status: boolean; color: string; text: string }>
  >;
  queryBarLoading: boolean;
  setQueryBarLoading: React.Dispatch<React.SetStateAction<boolean>>;
  searchSettings: SearchSettings;
  setSearchSettings: React.Dispatch<React.SetStateAction<SearchSettings>>;
  tagText: string;
  setTagText: React.Dispatch<React.SetStateAction<string>>;
  applicantCard: ApplicantCard;
  setApplicantCard: React.Dispatch<React.SetStateAction<ApplicantCard>>;
  settingsModalOpen: boolean;
  setSettingsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedKeys: "all" | Iterable<Key> | undefined;
  setSelectedKeys: React.Dispatch<
    React.SetStateAction<"all" | Iterable<Key> | undefined>
  >;
  rowsPerPage: number;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: React.Dispatch<React.SetStateAction<SortDescriptor>>;
  tablePage: number;
  setTablePage: React.Dispatch<React.SetStateAction<number>>;
  positions: Position[];
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
  positionSearchText: string;
  setPositionSearchText: React.Dispatch<React.SetStateAction<string>>;
  filterModalOpen: boolean;
  setFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  locationSearchText: string;
  setLocationSearchText: React.Dispatch<React.SetStateAction<string>>;
  settingsTab: QueryTerminalSettingsTab;
  setSettingsTab: React.Dispatch<
    React.SetStateAction<QueryTerminalSettingsTab>
  >;
  latestApplicants: Applicant[];
  setLatestApplicants: React.Dispatch<React.SetStateAction<Applicant[]>>;
  firstQuery: boolean;
  setFirstQuery: React.Dispatch<React.SetStateAction<boolean>>;
};

const QueryTerminalContext = createContext<QueryTerminal | undefined>(
  undefined
);

const QueryTerminalProvider = QueryTerminalContext.Provider;

export const useQueryTerminal = () => {
  const context = useContext(QueryTerminalContext);

  if (!context)
    throw new Error("use useQueryTerminal within a QueryTerminalProvider");

  return context;
};

export const QueryTerminalManager = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [applicants, setApplicants] = useState<ApplicantRow[]>([]);

  const [query, setQuery] = useState<Query>({
    id: uuidv4(),
    tags: [],
    filter: {
      positionFilter: 1,
      countryCodeFilter: [],
      statusFilter: [],
      starsFilter: -1,
      yoeFilter: {
        min: -1,
        max: -1,
      },
    },
  });

  const [tableLoading, setTableLoading] = useState({
    status: true,
    color: "default",
    text: "Loading Search Settings...",
  });
  const [queryBarLoading, setQueryBarLoading] = useState<boolean>(true);

  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);

  const [searchSettings, setSearchSettings] = useState<SearchSettings>({
    deepTopK: 10,
    flashTopK: 20,
    deepWeight: 0.5,
    flash: false,
  });

  const [tagText, setTagText] = useState<string>("");

  const [applicantCard, setApplicantCard] = useState<ApplicantCard>({
    display: false,
  });

  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  const [selectedKeys, setSelectedKeys] = useState<
    "all" | Iterable<Key> | undefined
  >(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "score",
    direction: "descending",
  });
  const [tablePage, setTablePage] = useState<number>(1);

  const [positions, setPositions] = useState<Position[]>([
    { id: 1, name: "General Application", status: "open" },
  ]);
  const [positionSearchText, setPositionSearchText] = useState<string>("");

  const [locationSearchText, setLocationSearchText] = useState<string>("");

  const [settingsTab, setSettingsTab] =
    useState<QueryTerminalSettingsTab>("filters");

  const [latestApplicants, setLatestApplicants] = useState<Applicant[]>([]);

  const [firstQuery, setFirstQuery] = useState<boolean>(true);
  return (
    <QueryTerminalProvider
      value={{
        applicants,
        setApplicants,
        query,
        setQuery,
        tableLoading,
        setTableLoading,
        queryBarLoading,
        setQueryBarLoading,
        searchSettings,
        setSearchSettings,
        tagText,
        setTagText,
        applicantCard,
        setApplicantCard,
        settingsModalOpen,
        setSettingsModalOpen,
        selectedKeys,
        setSelectedKeys,
        rowsPerPage,
        setRowsPerPage,
        sortDescriptor,
        setSortDescriptor,
        tablePage,
        setTablePage,
        positions,
        setPositions,
        positionSearchText,
        setPositionSearchText,
        filterModalOpen,
        setFilterModalOpen,
        locationSearchText,
        setLocationSearchText,
        settingsTab,
        setSettingsTab,
        latestApplicants,
        setLatestApplicants,
        firstQuery,
        setFirstQuery,
      }}
    >
      {children}
    </QueryTerminalProvider>
  );
};
