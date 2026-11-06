import { isSessionAuthError } from "@/api/auth/errors";
import { clearSessionCookies } from "@/api/auth/session";
import { toActionFailure } from "@/api/utils/action-failure";

import type { ActionFailure } from "@/api/utils/action-failure";

/**
 * Server-only wrapper: clear the cookie pair before returning a session
 * failure so the proxy cannot bounce `/login` back to `/dashboard`.
 */
export const toServerActionFailure = async (
  error: unknown,
  fallback: string,
): Promise<ActionFailure> => {
  if (isSessionAuthError(error)) {
    await clearSessionCookies();
  }

  return toActionFailure(error, fallback);
};
