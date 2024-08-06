export {};

export type Roles = "admin" | "recruiter" | "applicant";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
