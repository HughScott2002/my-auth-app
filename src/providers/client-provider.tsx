"use client";
// src/providers/client-provider.tsx
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const protectedRoutes = ["/dashboard", "/profile", "/settings"];
    const authRoutes = ["/login", "/register"];

    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.includes(pathname);

    if (isProtectedRoute && !isAuthenticated) {
      console.log(
        "Protected route accessed without auth, redirecting to login"
      );
      router.push("/login");
    } else if (isAuthRoute && isAuthenticated) {
      console.log(
        "Auth route accessed while authenticated, redirecting to dashboard"
      );
      router.push("/dashboard");
    }
  }, [pathname, isAuthenticated, router]);

  return children;
}
