// src/lib/auth.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { User, Session } from "@/types/auth";

type AuthState = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  setAuth: (user: User, session: Session) => void;
  logout: () => void;
};

const cookieStorage = {
  getItem: (name: string) => {
    const cookieValue = Cookies.get(name);
    return cookieValue ? JSON.parse(cookieValue) : null;
  },
  setItem: (name: string, value: any) => {
    Cookies.set(name, JSON.stringify(value), {
      expires: 7,
      path: "/",
      sameSite: "strict",
    });
  },
  removeItem: (name: string) => Cookies.remove(name),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "auth-storage",
      storage: cookieStorage,
    }
  )
);
