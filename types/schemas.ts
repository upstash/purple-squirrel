import {
  ApplicantData,
  ApplicantMetadata,
  ApplicantRow,
  Applicant,
  NextUIColor,
  ConsoleTab,
  SetupTab,
  DashboardTab,
  QueryTerminalSettingsTab,
  ApplicantStatus,
  CountryCode,
  PositionStatus,
  SchedulingInterval,
  Scheduling,
  Role,
} from "./index";
import { z } from "zod";
import {
  APPLICANT_STATUS_OPTIONS,
  COUNTRY_CODES,
  NEXTUI_COLORS,
  CONSOLE_TABS,
  SETUP_TABS,
  DASHBOARD_TABS,
  QUERY_TERMINAL_SETTINGS_TABS,
  POSITION_STATUS_OPTIONS,
  SCHEDULING_INTERVAL_OPTIONS,
  ROLES,
} from "@/app/constants";

const applicantDataSchema = z.object({
  applicantInfo: z.object({
    name: z.string(),
    cover: z.string().optional(),
    contact: z.object({
      email: z.string(),
      phone: z.string(),
    }),
    urls: z
      .object({
        website: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      })
      .optional(),
    notes: z.string(),
  }),
  positionId: z.number(),
  resumeInfo: z.object({
    uploadthing: z.object({
      key: z.string(),
      url: z.string(),
    }),
    fullText: z.string(),
  }),
}) satisfies z.ZodType<ApplicantData>;

export const applicantStatusSchema = z.enum(
  APPLICANT_STATUS_OPTIONS
) satisfies z.ZodType<ApplicantStatus>;

export const countryCodeSchema = z.enum(
  COUNTRY_CODES
) satisfies z.ZodType<CountryCode>;

const applicantMetadataSchema = z.object({
  countryCode: countryCodeSchema,
  status: applicantStatusSchema,
  stars: z.number(),
  yoe: z.number(),
}) satisfies z.ZodType<ApplicantMetadata>;

const applicantSchema = z.object({
  id: z.string(),
  ...applicantDataSchema.shape,
  ...applicantMetadataSchema.shape,
}) satisfies z.ZodType<Applicant>;

export const applicantRowSchema = z.object({
  ...applicantSchema.shape,
  score: z.number(),
}) satisfies z.ZodType<ApplicantRow>;

export const nextUIColorSchema = z.enum(
  NEXTUI_COLORS
) satisfies z.ZodType<NextUIColor>;

export const consoleTabSchema = z.enum(
  CONSOLE_TABS
) satisfies z.ZodType<ConsoleTab>;

export const setupTabSchema = z.enum(SETUP_TABS) satisfies z.ZodType<SetupTab>;

export const dashboardTabSchema = z.enum(
  DASHBOARD_TABS
) satisfies z.ZodType<DashboardTab>;

export const queryTerminalSettingsTabSchema = z.enum(
  QUERY_TERMINAL_SETTINGS_TABS
) satisfies z.ZodType<QueryTerminalSettingsTab>;

export const positionStatusSchema = z.enum(
  POSITION_STATUS_OPTIONS
) satisfies z.ZodType<PositionStatus>;

export const schedulingIntervalSchema = z.enum(
  SCHEDULING_INTERVAL_OPTIONS
) satisfies z.ZodType<SchedulingInterval>;

export const schedulingSchema = z.object({
  schedulingInterval: schedulingIntervalSchema,
  schedulingNum: z.number(),
}) satisfies z.ZodType<Scheduling>;

export const roleSchema = z.enum(ROLES) satisfies z.ZodType<Role>;
