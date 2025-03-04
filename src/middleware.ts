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

// Helper function to check if a cookie is expired or close to expiring
function isTokenExpiredOrCloseToExpiry(request: NextRequest): boolean {
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  // If no access token but has refresh token, needs refresh
  if (!accessToken && refreshToken) {
    return true;
  }

  // Check for token expiration through custom metadata
  // If your JWT is httpOnly, you can't read its expiry directly,
  // so we'll use a separate cookie to track when it should expire
  const tokenRefreshTime = request.cookies.get("token_refresh_time");

  if (tokenRefreshTime) {
    const refreshTimestamp = parseInt(tokenRefreshTime.value);
    const now = Date.now();

    // If token is older than 14 minutes, consider it close to expiry
    // This gives a 1-minute buffer before the actual 15-minute expiry
    const FOURTEEN_MINUTES = 14 * 60 * 1000;

    if (now - refreshTimestamp > FOURTEEN_MINUTES) {
      return true;
    }
  }

  return false;
}

export async function middleware(request: NextRequest) {
  // Check for authentication cookies
  const accessToken = request.cookies.get("access_token");
  const refreshToken = request.cookies.get("refresh_token");

  console.log("********");
  console.log("Middleware checking route:", request.nextUrl.pathname);
  console.log("Access token exists:", !!accessToken);
  console.log("Refresh token exists:", !!refreshToken);
  console.log("********");

  let isAuthenticated = !!accessToken;
  const path = request.nextUrl.pathname;

  // Check if token needs refresh
  const needsRefresh = isTokenExpiredOrCloseToExpiry(request);

  // If token needs refresh and refresh token exists, try to get a new access token
  if (needsRefresh && refreshToken) {
    console.log("Token expired or close to expiry. Attempting to refresh...");

    try {
      // Create a new request to forward cookies
      const checkSessionURL = new URL(
        "http://localhost/api/users/auth/check-session",
        request.url
      );

      // Forward the original cookies to maintain the refresh token
      const headers = new Headers(request.headers);

      // Make the request to check-session
      const response = await fetch(checkSessionURL.toString(), {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (response.ok) {
        console.log("Successfully refreshed token");

        // If successful, the server has set a new access token cookie
        isAuthenticated = true;

        // Create a response that will be used if we need to redirect
        const res = NextResponse.redirect(
          new URL(request.nextUrl.pathname, request.url)
        );

        // Forward the new cookies from the check-session response
        response.headers.getSetCookie().forEach((cookie) => {
          res.headers.append("Set-Cookie", cookie);
        });

        // Set a timestamp cookie for when this token was refreshed
        res.cookies.set("token_refresh_time", Date.now().toString(), {
          path: "/",
          maxAge: 60 * 60, // 1 hour
          httpOnly: false, // Readable by JavaScript
        });

        // For auth pages, redirect to dashboard if authenticated
        if (path === "/login" || path === "/register") {
          console.log(
            "Redirecting authenticated user from auth page to dashboard"
          );
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // For protected routes, continue with the newly set cookies
        return res;
      } else {
        console.log("Failed to refresh token:", response.status);
        isAuthenticated = false;
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      isAuthenticated = false;
    }
  } else {
    isAuthenticated = !!accessToken || !!refreshToken;
  }

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

  // Update the token refresh time if we have an access token but no token_refresh_time
  if (accessToken && !request.cookies.get("token_refresh_time")) {
    const response = NextResponse.next();
    response.cookies.set("token_refresh_time", Date.now().toString(), {
      path: "/",
      maxAge: 60 * 60, // 1 hour
      httpOnly: false, // Readable by JavaScript
    });
    return response;
  }

  return NextResponse.next();
}
