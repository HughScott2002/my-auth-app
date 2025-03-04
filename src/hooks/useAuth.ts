// src/hooks/useAuth.ts
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

// Create separate APIs for different endpoints
const accountApi = axios.create({
  baseURL: "http://localhost/api/users/auth/account",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allows cookies to be sent and received
});

const authApi = axios.create({
  baseURL: "http://localhost/api/users/auth",
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
  const [isServerDown, setIsServerDown] = useState(false);

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
        // Check if this is a network error
        if (error instanceof Error && error.message === "Network Error") {
          setIsServerDown(true);
        }
      } finally {
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [checkAuth, router]);

  // Create a function to detect network errors
  const isNetworkError = (error: any): boolean => {
    return (
      error.message === "Network Error" ||
      error.code === "ECONNABORTED" ||
      !error.response
    );
  };

  // Set up an interceptor to refresh tokens on 401 errors
  useEffect(() => {
    // Add a response interceptor
    const refreshInterceptor = authApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Only attempt refresh if:
        // 1. It's a 401 error (unauthorized)
        // 2. We haven't already tried to refresh for this request
        // 3. We have a valid refresh token (checked by the server)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          document.cookie.includes("refresh_token")
        ) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const response = await authApi.get("/check-session");

            if (response.data.user) {
              // Update auth store with refreshed data
              setAuth(response.data.user, response.data.session);

              // Retry the original request
              return authApi(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, clear auth and redirect to login
            logoutStore();
            router.push("/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Same for the account API
    const accountRefreshInterceptor = accountApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          document.cookie.includes("refresh_token")
        ) {
          originalRequest._retry = true;

          try {
            const response = await authApi.get("/check-session");

            if (response.data.user) {
              setAuth(response.data.user, response.data.session);
              return accountApi(originalRequest);
            }
          } catch (refreshError) {
            logoutStore();
            router.push("/login");
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up the interceptors when the component unmounts
    return () => {
      authApi.interceptors.response.eject(refreshInterceptor);
      accountApi.interceptors.response.eject(accountRefreshInterceptor);
    };
  }, [logoutStore, router, setAuth]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      console.log("Sending login request:", credentials);
      try {
        const response = await accountApi.post("/login", credentials);
        console.log("Login response:", response.data);
        setIsServerDown(false);
        return response.data;
      } catch (error) {
        if (isNetworkError(error)) {
          setIsServerDown(true);
        }
        throw error;
      }
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
      console.error("Login failed:", error);

      if (isNetworkError(error)) {
        toast.error("Server is currently unavailable. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Login failed! Please check your credentials."
        );
      }
      throw error;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log("Sending registration request:", data);
      try {
        const response = await accountApi.post("/register", data);
        console.log("Registration response:", response.data);
        setIsServerDown(false);
        return response.data;
      } catch (error) {
        if (isNetworkError(error)) {
          setIsServerDown(true);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      setAuth(data.user, data.session);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      console.error("Registration failed:", error);

      if (isNetworkError(error)) {
        toast.error("Server is currently unavailable. Please try again later.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Registration failed! Please try again."
        );
      }
      throw error;
    },
  });

  // Separate function to handle client-side logout
  const performClientSideLogout = () => {
    // Clear cookies manually
    document.cookie =
      "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie =
      "token_refresh_time=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

    // Clear the auth store
    logoutStore();

    // Notify user
    toast.success("Logged out successfully");

    // Redirect to login page
    router.push("/login");
  };

  const logout = async () => {
    // If we already know the server is down, skip API call
    if (isServerDown) {
      console.log("Server is down, performing client-side logout only");
      performClientSideLogout();
      return;
    }

    try {
      // Try to call the server, but with a short timeout
      await accountApi
        .post("/logout", {}, { timeout: 2000 })
        .then(() => {
          console.log("Server-side logout successful");
        })
        .catch((err) => {
          console.warn("Logout API call failed:", err);
          if (isNetworkError(err)) {
            setIsServerDown(true);
          }
        });
    } finally {
      performClientSideLogout();
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
    isServerDown,
  };
}
