import React from "react";
import {Switch} from "@nextui-org/switch";
import {MoonIcon} from "./MoonIcon";
import {SunIcon} from "./SunIcon";

export function DarkModeSwitch({ defaultSelected, color, onChange }) {
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
