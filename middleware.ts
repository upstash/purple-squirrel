import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/',
  '/apply(.*)',
  '/console(.*)',
  '/recruiters(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/setup(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isAdminRoute(req)) {
    const { sessionClaims } = auth();
    if (!(sessionClaims?.metadata?.role === "admin")) {
      auth().protect(has => {
        return false;
      });
    }
  }
  else if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};