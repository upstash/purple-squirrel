'use client';

import React from "react";
import {Tabs, Tab} from "@nextui-org/react";
import {usePathname} from "next/navigation";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";

export default function ConsoleLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const pathname = usePathname();

    return (
      <section>
        <header className="flex items-center bg-default-50 m-unit-3 py-unit-2 px-unit-3 rounded-xl">
          <div className="flex-1 flex items-center justify-start">
            <div className="bg-secondary mx-unit-1 p-unit-4 rounded-full"></div>
            <h1 className="text-xl">Purple Squirrel</h1>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Tabs key={"primary"} color={"secondary"} aria-label="Tabs colors" selectedKey={pathname} radius="full">
              <Tab key="/console/query-terminal" title="Query Terminal" href="/console/query-terminal"/>
              <Tab key="/console/recent-queries" title="Recent Queries" href="/console/recent-queries"/>
              <Tab key="/console/saved-queries" title="Saved Queries" href="/console/saved-queries"/>
            </Tabs>
          </div>
          <div className="flex-1 flex items-center justify-end">
            <ThemeSwitcher/>
          </div>
        </header>
        {children}
      </section>
    )
  }