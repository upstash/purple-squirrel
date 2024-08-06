export const APPLICANT_STATUS_OPTIONS = [
  "newApply",
  "screening",
  "assessment",
  "interview",
  "shortlisted",
  "offer",
  "onboarding",
  "hired",
] as const;

export const APPLICANT_STATUS_COLOR_MAP = {
  newApply: "default",
  screening: "warning",
  assessment: "warning",
  interview: "warning",
  shortlisted: "danger",
  offer: "secondary",
  onboarding: "success",
  hired: "success",
};

export const POSITION_STATUS_OPTIONS = ["open", "closed"] as const;

export const POSITION_STATUS_COLOR_MAP = {
  open: "danger",
  closed: "default",
};

export const ROLES = ["user", "recruiter", "admin"] as const;

export const ROLE_COLOR_MAP = {
  user: "default",
  recruiter: "secondary",
  admin: "danger",
};
