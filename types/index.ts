import {
  COUNTRY_CODES,
  APPLICANT_STATUS_OPTIONS,
  NEXTUI_COLORS,
  CONSOLE_TABS,
  DASHBOARD_TABS,
  SETUP_TABS,
  QUERY_TERMINAL_SETTINGS_TABS,
  POSITION_STATUS_OPTIONS,
  SCHEDULING_INTERVAL_OPTIONS,
  ROLES,
} from "@/app/constants";

export type ApplicantData = {
  applicantInfo: {
    name: string;
    cover?: string;
    contact: {
      email: string;
      phone: string;
    };
    urls?: {
      website?: string;
      linkedin?: string;
      github?: string;
    };
    notes: string;
  };

  positionId: number;

  resumeInfo: {
    uploadthing: {
      key: string;
      url: string;
    };
    fullText: string;
  };
};

export type ApplicantStatus = (typeof APPLICANT_STATUS_OPTIONS)[number];

export type CountryCode = (typeof COUNTRY_CODES)[number] | undefined;

export type ApplicantMetadata = {
  countryCode: CountryCode;
  status: ApplicantStatus;
  stars: number;
  yoe: number;
};

export type Applicant = {
  id: string;
} & ApplicantData &
  ApplicantMetadata;

export type ApplicantRow = Applicant & {
  score: number;
};

export type ApplicantCard =
  | {
      display: false;
    }
  | ({
      display: true;
    } & ApplicantRow);

export type Filter = {
  positionFilter: number;
  countryCodeFilter: CountryCode[];
  statusFilter: string[];
  starsFilter: number;
  yoeFilter: {
    min: number;
    max: number;
  };
};

export type Query = {
  id: string;
  tags: string[];
  filter: Filter;
};

export type NextUIColor = (typeof NEXTUI_COLORS)[number] | undefined;

export type ConsoleTab = (typeof CONSOLE_TABS)[number];

export type DashboardTab = (typeof DASHBOARD_TABS)[number];

export type SetupTab = (typeof SETUP_TABS)[number];

export type QueryTerminalSettingsTab =
  (typeof QUERY_TERMINAL_SETTINGS_TABS)[number];

export type PositionStatus = (typeof POSITION_STATUS_OPTIONS)[number];

export type Position = {
  id: number;
  name: string;
  status: PositionStatus;
};

export type SearchSettings = {
  deepTopK: number;
  flashTopK: number;
  deepWeight: number;
  flash: boolean;
};

export type SchedulingInterval = (typeof SCHEDULING_INTERVAL_OPTIONS)[number];

export type Scheduling = {
  schedulingNum: number;
  schedulingInterval: SchedulingInterval;
};

export type Role = (typeof ROLES)[number];
