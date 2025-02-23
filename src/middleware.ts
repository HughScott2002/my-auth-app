// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth-storage");

  console.log("Middleware checking route:", request.nextUrl.pathname);

  let isAuthenticated = false;
  let sessionData = null;

  try {
    if (authCookie?.value) {
      const authData = JSON.parse(authCookie.value);
      isAuthenticated = !!authData?.state?.session?.id;
      sessionData = authData?.state?.session;
      console.log("Auth data:", {
        isAuthenticated,
        sessionId: sessionData?.id,
      });
    }
  } catch (error) {
    console.error("Error parsing auth cookie:", error);
  }

  const path = request.nextUrl.pathname;

  // Protected routes
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/profile") ||
    path.startsWith("/settings")
  ) {
    if (!isAuthenticated) {
      console.log("Unauthorized access attempt, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    console.log("Access granted to protected route");
    const response = NextResponse.next();
    return response;
  }

  // Auth routes (login/register)
  if ((path === "/login" || path === "/register") && isAuthenticated) {
    console.log(
      "Authenticated user accessing auth route, redirecting to dashboard"
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
