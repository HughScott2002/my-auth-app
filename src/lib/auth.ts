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
  setAuth: (user: User, session?: Session) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

const api = axios.create({
  baseURL: "http://localhost/api/users/auth/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: This allows cookies to be sent and received
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      setAuth: (user, session) => {
        console.log("Setting auth state:", { user, session });
        set({
          user,
          session,
          isAuthenticated: true,
        });
      },
      logout: () => {
        console.log("Clearing auth state");
        set({
          user: null,
          session: null,
          isAuthenticated: false,
        });
      },
      checkAuth: async () => {
        try {
          // Check session validity with the backend
          console.log("Checking authentication status...");
          const response = await api.get("/check-session");
          console.log("Auth check response:", response.data);

          if (response.data.user) {
            // Update the auth state with the latest user data
            set({
              user: response.data.user,
              session: response.data.session || get().session,
              isAuthenticated: true,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error("Auth check failed:", error);
          // Clear auth state if the check fails
          set({ user: null, session: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
