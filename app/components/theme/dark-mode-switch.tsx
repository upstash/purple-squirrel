import React from "react";
import {Switch} from "@nextui-org/switch";
import {MoonIcon} from "./moon-icon";
import {SunIcon} from "./sun-icon";
import type { NextUIColor } from "@/types";

type Props = {
  defaultSelected: boolean;
  color: NextUIColor;
  onChange: () => void;
};

export function DarkModeSwitch({ defaultSelected, color, onChange }: Props) {
  return (
    <Switch
      defaultSelected={defaultSelected}
      size="lg"
      color={color}
      onChange={onChange}
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <SunIcon className={className} />
        ) : (
          <MoonIcon className={className} />
        )
      }
    ></Switch>
  );
}
