import {
  ApplicantRow,
  NextUIColor,
  ConsoleTab,
  SetupTab,
  DashboardTab,
  QueryTerminalSettingsTab,
  ApplicantStatus,
  CountryCode,
  PositionStatus,
  Scheduling,
  Role,
} from "./index";
import {
  applicantRowSchema,
  nextUIColorSchema,
  consoleTabSchema,
  setupTabSchema,
  dashboardTabSchema,
  queryTerminalSettingsTabSchema,
  applicantStatusSchema,
  countryCodeSchema,
  positionStatusSchema,
  schedulingSchema,
  roleSchema,
} from "./schemas";

const isApplicantRow = (data: any): data is ApplicantRow => {
  return applicantRowSchema.safeParse(data).success;
};

export const isApplicantRowArray = (data: any): data is ApplicantRow[] => {
  return Array.isArray(data) && data.every(isApplicantRow);
};

export const isNextUIColor = (data: any): data is NextUIColor => {
  return nextUIColorSchema.safeParse(data).success;
};

export const isConsoleTab = (data: any): data is ConsoleTab => {
  return consoleTabSchema.safeParse(data).success;
};

export const isSetupTab = (data: any): data is SetupTab => {
  return setupTabSchema.safeParse(data).success;
};

export const isDashboardTab = (data: any): data is DashboardTab => {
  return dashboardTabSchema.safeParse(data).success;
};

export const isQueryTerminalSettingsTab = (
  data: any
): data is QueryTerminalSettingsTab => {
  return queryTerminalSettingsTabSchema.safeParse(data).success;
};

export const isApplicantStatus = (data: any): data is ApplicantStatus => {
  return applicantStatusSchema.safeParse(data).success;
};

export const isCountryCode = (data: any): data is CountryCode => {
  return countryCodeSchema.safeParse(data).success;
};

export const isPositionStatus = (data: any): data is PositionStatus => {
  return positionStatusSchema.safeParse(data).success;
};

export const isScheduling = (data: any): data is Scheduling => {
  return schedulingSchema.safeParse(data).success;
};

export const isRole = (data: any): data is Role => {
  return roleSchema.safeParse(data).success;
};
