"use client";

import {useTheme} from "next-themes";
import { useEffect, useState } from "react";
import {DarkModeSwitch} from "./dark-mode-switch";

import type { NextUIColor } from "@/types";

type Props = {
  color: NextUIColor;
};

export function ThemeSwitcher( { color }: Props ) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <DarkModeSwitch defaultSelected={theme === 'light' ? true : false} color={color} onChange={() => setTheme(theme === 'light' ? 'dark': 'light')} />
  )
};