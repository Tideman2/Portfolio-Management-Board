"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { REAUTH_PATH } from "@/routes/reauth";

/**
 * The action clears the cookies before returning a session failure, so this
 * redirect cannot loop through the proxy's fresh-token check.
 */
export const useSessionExpiry = (expired: boolean): void => {
  const router = useRouter();

  useEffect(() => {
    if (!expired) {
      return;
    }

    router.replace(REAUTH_PATH);
    router.refresh();
  }, [expired, router]);
};
