"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "writer";
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AdminUser | null;
  setSession: (data: { accessToken: string; refreshToken: string; user: AdminUser }) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

// Persisted to localStorage under "bda-admin-auth" so a page refresh
// doesn't log the writer out. Access tokens are short-lived (15m) by
// design — see adminApi.ts for the silent-refresh handling.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setSession: ({ accessToken, refreshToken, user }) => set({ accessToken, refreshToken, user }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    { name: "bda-admin-auth" }
  )
);
