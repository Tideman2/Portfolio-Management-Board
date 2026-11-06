import { isSessionAuthError } from "@/api/auth/errors";
import { extractFieldErrors, extractServerError } from "@/api/utils/server-error";

import type { ActionResult } from "@/api/utils/action-result";

export type ActionFailure = Extract<ActionResult<never>, { success: false }>;

export const SESSION_EXPIRED_MESSAGE = "Your session has ended. Sign in again.";

/**
 * Converts an API error into an action-safe failure. Session failures are
 * marked explicitly so a view can redirect to reauthentication; every other
 * error goes through the shared 5xx/network redaction path.
 */
export const toActionFailure = (
  error: unknown,
  fallback: string,
): ActionFailure => {
  if (isSessionAuthError(error)) {
    return {
      success: false,
      error: SESSION_EXPIRED_MESSAGE,
      status: 401,
      sessionExpired: true,
    };
  }

  const extracted = extractServerError(error, fallback);
  const fieldErrors =
    extracted.status !== undefined && extracted.status < 500
      ? extractFieldErrors(error)
      : undefined;

  return {
    success: false,
    ...extracted,
    ...(fieldErrors === undefined ? {} : { fieldErrors }),
  };
};
