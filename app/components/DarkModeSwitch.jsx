import React from "react";
import {Switch} from "@nextui-org/switch";
import {MoonIcon} from "./MoonIcon";
import {SunIcon} from "./SunIcon";

export function DarkModeSwitch({ defaultSelected, onChange }) {
  return (
    <Switch
      defaultSelected={defaultSelected}
      size="lg"
      color="secondary"
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
