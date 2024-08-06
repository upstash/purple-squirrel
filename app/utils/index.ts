import type { ConsoleTab, NextUIColor, ApplicantStatus, Role, PositionStatus } from "@/types";
import { isNextUIColor } from "@/types/validations";
import { APPLICANT_STATUS_COLOR_MAP, ROLE_COLOR_MAP, POSITION_STATUS_COLOR_MAP} from "@/app/constants";

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getApplicantStatusColor(status: ApplicantStatus): NextUIColor {
  const color = APPLICANT_STATUS_COLOR_MAP[status];
  if (isNextUIColor(color)) {
      return color;
  } else {
      return "default";
  }
}

export function getRoleColor(role: Role): NextUIColor {
  const color = ROLE_COLOR_MAP[role];
  if (isNextUIColor(color)) {
      return color;
  } else {
      return "default";
  }
}

export function getPositionStatusColor(status: PositionStatus): NextUIColor {
  const color = POSITION_STATUS_COLOR_MAP[status];
  if (isNextUIColor(color)) {
      return color;
  } else {
      return "default";
  }
}