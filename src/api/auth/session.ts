import { getCookieValue, removeCookie, setCookie } from "@/api/utils/cookies";
import { authConfig, userCookieOptions } from "@/config/auth";

import type { AdminUser } from "@/api/auth/types";

export const clearSessionCookies = async (): Promise<void> => {
  await Promise.all([
    removeCookie(authConfig.tokenCookie),
    removeCookie(authConfig.userCookie),
  ]);
};

export const getSessionToken = async (): Promise<string | undefined> =>
  getCookieValue(authConfig.tokenCookie);

export const setSessionUser = async (user: AdminUser): Promise<void> => {
  await setCookie(authConfig.userCookie, JSON.stringify(user), {
    maxAge: userCookieOptions.maxAge,
  });
};

export const getStoredSessionUser = async (): Promise<AdminUser | null> => {
  const raw = await getCookieValue(authConfig.userCookie);

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof (parsed as AdminUser).id === "number" &&
      typeof (parsed as AdminUser).username === "string"
    ) {
      const user = parsed as AdminUser;
      return { id: user.id, username: user.username };
    }

    return null;
  } catch {
    return null;
  }
};
