import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/"]);

const isAdminRoute = createRouteMatcher(["/dashboard(.*)", "/setup(.*)"]);

const isRecruiterRoute = createRouteMatcher(["/console(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isAdminRoute(req)) {
    const { sessionClaims } = auth();
    if (!(sessionClaims?.metadata?.role === "admin")) {
      auth().protect((has) => {
        return false;
      });
    }
  } else if (isRecruiterRoute(req)) {
    const { sessionClaims } = auth();
    if (
      !(
        sessionClaims?.metadata?.role === "recruiter" ||
        sessionClaims?.metadata?.role === "admin"
      )
    ) {
      auth().protect((has) => {
        return false;
      });
    }
  } else if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
