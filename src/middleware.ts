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
  // Check for authentication cookies
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  console.log("Middleware checking route:", request.nextUrl.pathname);
  console.log("Access token exists:", !!accessToken);
  console.log("Refresh token exists:", !!refreshToken);

  const isAuthenticated = !!accessToken || !!refreshToken;
  const path = request.nextUrl.pathname;

  // Protect routes that require authentication
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
  }

  // Redirect authenticated users away from auth pages
  if ((path === "/login" || path === "/register") && isAuthenticated) {
    console.log(
      "Authenticated user accessing auth route, redirecting to dashboard"
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}
