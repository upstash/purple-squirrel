'use client';

import React from "react";
import {Tabs, Tab} from "@nextui-org/react";
import {usePathname} from "next/navigation";

export default function ConsoleLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const pathname = usePathname();

    return (
      <section>
        <header className="flex items-center justify-center bg-zinc-900 m-unit-2 p-unit-2 rounded-xl">
          <Tabs key={"primary"} color={"secondary"} aria-label="Tabs colors" selectedKey={pathname} radius="full">
            <Tab key="/console/query-terminal" title="Query Terminal" href="/console/query-terminal"/>
            <Tab key="/console/recent-queries" title="Recent Queries" href="/console/recent-queries"/>
            <Tab key="/console/saved-queries" title="Saved Queries" href="/console/saved-queries"/>
          </Tabs>
        </header>
        {children}
      </section>
    )
  }