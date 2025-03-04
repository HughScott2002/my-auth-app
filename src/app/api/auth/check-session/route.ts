// src/app/api/users/auth/check-session/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to your backend server
    const backendUrl = "http://localhost/api/users/auth/check-session";

    // Create headers to forward
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    // Forward cookies
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers.set("cookie", cookieHeader);
    }

    // Make the request to your backend
    const backendResponse = await fetch(backendUrl, {
      method: "GET",
      headers,
      credentials: "include",
    });

    // Get response data
    const data = await backendResponse.json().catch(() => null);

    // Create the response
    const response = NextResponse.json(
      data || { message: "No valid session" },
      { status: backendResponse.status }
    );

    // Forward cookies from backend response
    backendResponse.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        response.headers.append(key, value);
      }
    });

    return response;
  } catch (error) {
    console.error("Error in check-session API route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
