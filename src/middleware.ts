import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook(.*)",
]);

// Define API routes
const isApiRoute = createRouteMatcher(["/api/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Check if it's a public route - allow access without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Check authentication for protected routes
  const session = await auth();
  const userId = session.userId;

  // For API routes, return JSON response instead of redirecting
  if (isApiRoute(req) && !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // For other protected routes, redirect to sign-in if not authenticated
  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
