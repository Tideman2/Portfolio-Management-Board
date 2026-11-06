type ErrorResponse = {
  status?: number;
  data?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getStatus = (error: unknown): number | undefined => {
  if (!isRecord(error) || !isRecord(error.response)) {
    return undefined;
  }

  const { status } = error.response;
  return typeof status === "number" ? status : undefined;
};

const getErrorString = (error: unknown): string | undefined => {
  if (!isRecord(error) || !isRecord(error.response)) {
    return undefined;
  }

  const data = error.response.data;

  if (!isRecord(data)) {
    return typeof data === "string" && data.trim().length > 0
      ? data
      : undefined;
  }

  const { error: message } = data;
  return typeof message === "string" && message.trim().length > 0
    ? message
    : undefined;
};

/**
 * The contract has no refresh endpoint. A 401 (missing/expired token) or a
 * 403 (malformed token) both mean the session is gone and the admin must sign
 * in again.
 */
export const isSessionAuthError = (error: unknown): boolean => {
  const status = getStatus(error);
  return status === 401 || status === 403;
};

/**
 * Login rejects bad credentials with 401. That is a form error, not an ended
 * session, so callers must not redirect to the login notice for it.
 */
export const isInvalidCredentialsError = (error: unknown): boolean =>
  getStatus(error) === 401 &&
  getErrorString(error) === "Invalid credentials";

export type { ErrorResponse };
