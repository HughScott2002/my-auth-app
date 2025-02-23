// src/app/api/auth/register/route.ts
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  console.log("Register API route hit"); // Add this log

  try {
    const body = await request.json();
    const { email, password, name } = body;

    console.log("Registration attempt received for:", email);
    console.log("Registration attempt received for:", name);

    // Simulate a small delay to show loading states
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // This is a placeholder response
    const response = {
      user: {
        id: "1",
        email,
        name,
      },
      token: "dummy_token_" + Math.random(),
    };

    console.log("Registration successful, returning:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        error: "Registration failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
