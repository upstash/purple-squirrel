"use client";

import {
  ConsoleManager,
  QueryTerminalManager,
  QueriesManager,
} from "@/app/managers";

export function ConsoleManagers({ children }: { children: React.ReactNode }) {
  return (
    <ConsoleManager>
      <QueryTerminalManager>
        <QueriesManager>{children}</QueriesManager>
      </QueryTerminalManager>
    </ConsoleManager>
  );
}
