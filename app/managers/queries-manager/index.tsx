import { createContext, useContext, useState } from "react";

import type { Query } from "@/types";

type Queries = {
  recentQueries: Query[];
  setRecentQueries: React.Dispatch<React.SetStateAction<Query[]>>;
  recentQueriesLoading: boolean;
  setRecentQueriesLoading: React.Dispatch<React.SetStateAction<boolean>>;
  savedQueries: Query[];
  setSavedQueries: React.Dispatch<React.SetStateAction<Query[]>>;
  savedQueriesLoading: boolean;
  setSavedQueriesLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const QueriesContext = createContext<Queries | undefined>(undefined);

const QueriesProvider = QueriesContext.Provider;

export const useQueries = () => {
  const context = useContext(QueriesContext);

  if (!context) throw new Error("use useQueries within a QueriesProvider");

  return context;
};

export const QueriesManager = ({ children }: { children: React.ReactNode }) => {
  const [recentQueries, setRecentQueries] = useState<Query[]>([]);
  const [savedQueries, setSavedQueries] = useState<Query[]>([]);
  const [recentQueriesLoading, setRecentQueriesLoading] = useState(true);
  const [savedQueriesLoading, setSavedQueriesLoading] = useState(true);
  return (
    <QueriesProvider
      value={{
        recentQueries,
        setRecentQueries,
        recentQueriesLoading,
        setRecentQueriesLoading,
        savedQueries,
        setSavedQueries,
        savedQueriesLoading,
        setSavedQueriesLoading,
      }}
    >
      {children}
    </QueriesProvider>
  );
};
