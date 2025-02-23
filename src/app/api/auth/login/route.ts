// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("Login attempt received for:", email);

    // Simulate a small delay to show loading states
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // This is a placeholder response
    const response = {
      user: {
        id: "1",
        email,
        name: "John Doe",
      },
      token: "dummy_token_" + Math.random(),
    };

    console.log("Login successful, returning:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}
