'use client';

import React from "react";
import {Tabs, Tab} from "@nextui-org/react";
import {usePathname} from "next/navigation";
import { ThemeSwitcher } from "@/app/components/ThemeSwitcher";
import {SquirrelIcon} from '@primer/octicons-react'
import path from "path";

export default function ConsoleLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const pathname = usePathname();
    const varColor = ((pathname === "/console/query-terminal") ? "secondary" : (pathname === "/console/recent-queries") ? "warning" : "primary");

    return (
      <section className="flex flex-col box-border h-screen">
        <header className="flex-initial p-unit-4">
          <div className="flex items-center bg-default-50 py-unit-2 px-unit-1 rounded-xl">
            <div className="flex-1 flex items-center justify-start">
              <div className="text-secondary pl-unit-3 pr-unit-1">
                <SquirrelIcon size={32} className="scale-x-[-1]" />
              </div>
              <h1 className="text-xl">Purple Squirrel</h1>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <Tabs key={"primary"} color={varColor} aria-label="Tabs colors" selectedKey={pathname} radius="full">
                <Tab key="/console/query-terminal" title="Query Terminal" href="/console/query-terminal"/>
                <Tab key="/console/recent-queries" title="Recent Queries" href="/console/recent-queries"/>
                <Tab key="/console/saved-queries" title="Saved Queries" href="/console/saved-queries"/>
              </Tabs>
            </div>
            <div className="flex-1 flex items-center justify-end">
              <ThemeSwitcher color={varColor} />
            </div>
          </div>
        </header>
        <div className="flex-auto px-unit-4 pb-unit-4">
          {children}
        </div>
      </section>
    )
  }