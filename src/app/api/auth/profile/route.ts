// src/app/api/auth/profile/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get("authorization");

    console.log("Profile fetch attempt with token:", token);

    if (!token) {
      console.log("No token provided for profile fetch");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Simulate a small delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // This is a placeholder response
    const response = {
      user: {
        id: "1",
        email: "john@example.com",
        name: "John Doe",
        joinedAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      },
    };

    console.log("Profile fetch successful, returning:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 401 }
    );
  }
}
