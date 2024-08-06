import { createContext, useContext, useState } from "react";
import type { ConsoleTab } from "@/types";

type Console = {
  activeTab: ConsoleTab;
  setActiveTab: (tab: ConsoleTab) => void;
};

const ConsoleContext = createContext<Console | undefined>(undefined);

const ConsoleProvider = ConsoleContext.Provider;

export const useConsole = () => {
  const context = useContext(ConsoleContext);

  if (!context) throw new Error("use useConsole within a ConsoleProvider");

  return context;
};

export const ConsoleManager = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<ConsoleTab>("query-terminal");
  return (
    <ConsoleProvider
      value={{
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </ConsoleProvider>
  );
};
