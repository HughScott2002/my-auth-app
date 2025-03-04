// src/lib/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  kycStatus: string;
};

type Session = {
  id: string;
  browser: string;
  ipAddress: string;
  deviceInfo: string;
};

type AuthState = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  lastTokenRefresh: number; // timestamp of last refresh
  setAuth: (user: User, session?: Session) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

const api = axios.create({
  baseURL: "http://localhost/api/users/auth/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      lastTokenRefresh: 0,
      setAuth: (user, session) => {
        console.log("Setting auth state:", { user, session });
        set({
          user,
          session,
          isAuthenticated: true,
          lastTokenRefresh: Date.now(),
        });
      },
      logout: () => {
        console.log("Clearing auth state");
        set({
          user: null,
          session: null,
          isAuthenticated: false,
          lastTokenRefresh: 0,
        });
      },
      checkAuth: async () => {
        try {
          const currentState = get();
          const timeSinceRefresh = Date.now() - currentState.lastTokenRefresh;
          const FIFTEEN_MINUTES = 15 * 60 * 1000;

          // If we have a recent token refresh (less than 15 minutes ago), use cached user data
          if (
            currentState.isAuthenticated &&
            currentState.user &&
            timeSinceRefresh < FIFTEEN_MINUTES
          ) {
            console.log(
              "Using cached authentication - last refresh was",
              Math.round(timeSinceRefresh / 1000 / 60),
              "minutes ago"
            );
            return true;
          }

          // Otherwise check with the server
          console.log("Checking authentication with server...");
          const response = await api.get("/check-session");
          console.log("Auth check response:", response.data);

          if (response.data && response.data.user) {
            // Update the auth state with the latest user data
            set({
              user: response.data.user,
              session: response.data.session || get().session,
              isAuthenticated: true,
              lastTokenRefresh: Date.now(),
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Auth check failed:", error);

          // Check for 401 unauthorized errors
          if (error.response && error.response.status === 401) {
            console.log("Received 401 Unauthorized response");
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              lastTokenRefresh: 0,
            });
            console.log("Cleared the Auth State due to 401");
            return false;
          }

          // Check for network errors
          if (error.message === "Network Error" && get().user) {
            console.log("Network error but using cached user data");
            return true;
          }

          // Otherwise clear auth state
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            lastTokenRefresh: 0,
          });
          console.log("Cleared the Auth State");
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
