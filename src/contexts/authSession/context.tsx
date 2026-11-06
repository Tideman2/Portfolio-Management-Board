"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getSessionUser } from "@/app/actions/session-actions";
import { extractErrorMessage } from "@/utils/display";

import type { ReactNode } from "react";
import type { AdminUser } from "@/api/auth/types";

export type AuthSessionValue = {
  user: AdminUser | null;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  error: string | null;
  checkUserSession: () => Promise<AdminUser | null>;
};

export const AuthSessionContext = createContext<AuthSessionValue | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkUserSession = useCallback(async (): Promise<AdminUser | null> => {
    setLoading(true);
    setError(null);

    try {
      const sessionUser = await getSessionUser();
      setUser(sessionUser);
      return sessionUser;
    } catch (cause) {
      console.error(
        "Error checking admin session:",
        cause instanceof Error ? cause.message : "Unknown error",
      );
      setUser(null);
      setError(extractErrorMessage(cause, "Unable to load your session."));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Defer to the next microtask so the initial session check does not update
    // state synchronously inside the effect body.
    queueMicrotask(() => {
      void checkUserSession();
    });
  }, [checkUserSession]);

  const value = useMemo<AuthSessionValue>(
    () => ({
      user,
      loading,
      authenticated: !loading && user !== null,
      unauthenticated: !loading && user === null && error === null,
      error,
      checkUserSession,
    }),
    [user, loading, error, checkUserSession],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}
