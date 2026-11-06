"use server";

import { isSessionAuthError } from "@/api/auth/errors";
import { verifyAdminToken } from "@/api/auth/server-side";
import {
  clearSessionCookies,
  getSessionToken,
  getStoredSessionUser,
} from "@/api/auth/session";

import type { AdminUser } from "@/api/auth/types";

/**
 * Canonical client session probe. The contract has no `/me` for the admin
 * account, so the cached user details come from the login response cookie and
 * validity comes from `POST /api/auth/verify`.
 *
 * Auth failures clear the cookies and return null; infrastructure failures
 * throw so the shell can offer a retry instead of faking a sign-out.
 */
export async function getSessionUser(): Promise<AdminUser | null> {
  const token = await getSessionToken();

  if (!token) {
    return null;
  }

  try {
    const verified = await verifyAdminToken(token);

    if (!verified) {
      await clearSessionCookies();
      return null;
    }

    const user = await getStoredSessionUser();

    if (user === null) {
      await clearSessionCookies();
      return null;
    }

    return user;
  } catch (error) {
    if (isSessionAuthError(error)) {
      await clearSessionCookies();
      return null;
    }

    throw error;
  }
}
