"use client";
// src/providers/client-provider.tsx
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { isLoading } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // First useEffect just to mark when initial loading is complete
  useEffect(() => {
    if (!isLoading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isLoading, isInitialLoad]);

  // Only run routing logic after auth state is stable
  useEffect(() => {
    // Skip during initial load
    if (isLoading || isInitialLoad) {
      console.log(
        "Client Provider: Still loading auth state, skipping routing checks"
      );
      return;
    }

    console.log("Client Provider: Auth loading complete");
    console.log("Pathname:", pathname);
    console.log("Is authenticated:", isAuthenticated);

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
  }, [pathname, isAuthenticated, router, isLoading, isInitialLoad]);

  return children;
}
