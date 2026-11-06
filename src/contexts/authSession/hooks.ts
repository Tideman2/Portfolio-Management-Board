"use client";

import { useContext } from "react";

import { AuthSessionContext } from "@/contexts/authSession/context";

import type { AuthSessionValue } from "@/contexts/authSession/context";

export const useAuthSession = (): AuthSessionValue => {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within an AuthProvider");
  }

  return context;
};
