// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const api = axios.create({
  baseURL: "http://localhost/api/users/auth/account",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allows cookies to be sent and received
});

export function useAuth() {
  const router = useRouter();
  const {
    setAuth,
    logout: logoutStore,
    user,
    isAuthenticated,
    session,
    checkAuth,
  } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const verifyAuth = async () => {
      setIsCheckingAuth(true);
      try {
        console.log("Verifying authentication on page load...");
        const isAuthed = await checkAuth();
        console.log("Auth verified:", isAuthed);

        // If authenticated on login/register page, redirect to dashboard
        const path = window.location.pathname;
        if (isAuthed && (path === "/login" || path === "/register")) {
          console.log("Redirecting to dashboard...");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [checkAuth, router]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log("Sending login request:", credentials);
      const response = await api.post("/login", credentials);
      console.log("Login response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      setAuth(data.user, data.session);
      toast.success(
        `Welcome${data.user.firstName ? " " + data.user.firstName : ""}!`
      );
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Login failed! Please check your credentials."
      );
      throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending registration request:", data);
      const response = await api.post("/register", data);
      console.log("Registration response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      setAuth(data.user, data.session);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Registration failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed! Please try again."
      );
      throw error;
    },
  });

  const logout = async () => {
    try {
      // If you have a logout endpoint
      await api
        .post("/logout")
        .catch((err) => console.warn("Logout API call failed:", err));
    } finally {
      logoutStore();
      toast.success("Logged out successfully");
      router.push("/login");
    }
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading:
      loginMutation.isPending || registerMutation.isPending || isCheckingAuth,
    user,
    session,
    isAuthenticated,
  };
}
