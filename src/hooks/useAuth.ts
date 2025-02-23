// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost/api/users/auth/account",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
);

export function useAuth() {
  const router = useRouter();
  const {
    setAuth,
    logout: logoutStore,
    user,
    isAuthenticated,
    session,
  } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log("Sending login request:", credentials);
      const response = await api.post("/login", credentials);
      console.log("Login response:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Setting auth state with:", data);
      setAuth(data.user, data.session);
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error);
      toast.error(
        error.response?.data?.message || "Login failed! Please try again."
      );
    },
  });

  const logout = () => {
    logoutStore();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return {
    login: loginMutation.mutate,
    logout,
    isLoading: loginMutation.isPending,
    user,
    session,
    isAuthenticated,
  };
}
