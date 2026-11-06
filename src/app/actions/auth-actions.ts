"use server";

import { jwtDecode } from "jwt-decode";

import { loginAdmin } from "@/api/auth/server-side";
import { loginSchema } from "@/api/auth/schemas";
import { clearSessionCookies, setSessionUser } from "@/api/auth/session";
import { isInvalidCredentialsError } from "@/api/auth/errors";
import { setCookie } from "@/api/utils/cookies";
import { extractServerError } from "@/api/utils/server-error";
import {
  DEFAULT_TOKEN_MAX_AGE,
  authConfig,
} from "@/config/auth";

import type { AdminUser } from "@/api/auth/types";
import type { LoginInput } from "@/api/auth/schemas";
import type { ActionResult } from "@/api/utils/action-result";

const logFailure = (context: string, error: unknown): void => {
  console.error(
    context,
    error instanceof Error ? error.message : "Unknown error",
  );
};

/** Prefer the token's own `exp` so the cookie dies with the token. */
const tokenMaxAge = (token: string): number => {
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);

    if (typeof exp !== "number") {
      return DEFAULT_TOKEN_MAX_AGE;
    }

    const seconds = Math.floor(exp - Date.now() / 1000);

    return seconds > 0 ? seconds : DEFAULT_TOKEN_MAX_AGE;
  } catch {
    return DEFAULT_TOKEN_MAX_AGE;
  }
};

export async function login(
  payload: LoginInput,
): Promise<ActionResult<AdminUser>> {
  const parsed = loginSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check your details.",
    };
  }

  try {
    const session = await loginAdmin(parsed.data);

    if (!session.access_token || !session.user) {
      return { success: false, error: "Unable to sign in." };
    }

    await setCookie(authConfig.tokenCookie, session.access_token, {
      maxAge: tokenMaxAge(session.access_token),
    });
    await setSessionUser(session.user);

    return { success: true, data: session.user };
  } catch (error) {
    await clearSessionCookies().catch((cause: unknown) => {
      logFailure("Unable to clear auth cookies:", cause);
    });

    logFailure("Admin login failed:", error);

    if (isInvalidCredentialsError(error)) {
      return { success: false, error: "Invalid username or password." };
    }

    return { success: false, ...extractServerError(error, "Unable to sign in.") };
  }
}

export async function logout(): Promise<ActionResult<null>> {
  try {
    await clearSessionCookies();
  } catch (error) {
    logFailure("Unable to clear auth cookies:", error);
  }

  return { success: true, data: null };
}
