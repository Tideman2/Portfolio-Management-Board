const DEFAULT_FALLBACK = "Something went wrong. Please try again.";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const nonEmptyString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0 ? value : undefined;

/**
 * Contract error shape: `{ "errors": { "field": ["Message"] } }`.
 * Maps each field to its first message for inline form display.
 */
export const extractFieldErrors = (
  error: unknown,
): Record<string, string> | undefined => {
  if (!isRecord(error) || !isRecord(error.response)) {
    return undefined;
  }

  const data = error.response.data;

  if (!isRecord(data) || !isRecord(data.errors)) {
    return undefined;
  }

  const fieldErrors: Record<string, string> = {};

  for (const [field, messages] of Object.entries(data.errors)) {
    if (!Array.isArray(messages)) {
      continue;
    }

    const message = messages.map(nonEmptyString).find(Boolean);

    if (message) {
      fieldErrors[field] = message;
    }
  }

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
};

const getValidationMessage = (data: unknown): string | undefined => {
  if (!isRecord(data) || !isRecord(data.errors)) {
    return undefined;
  }

  for (const [field, messages] of Object.entries(data.errors)) {
    if (!Array.isArray(messages)) {
      continue;
    }

    const message = messages.map(nonEmptyString).find(Boolean);

    if (message) {
      return `${field}: ${message}`;
    }
  }

  return undefined;
};

const getResponseData = (error: Record<string, unknown>): unknown => {
  const response = isRecord(error.response) ? error.response : undefined;
  return response?.data;
};

const getErrorMessage = (error: unknown): string | undefined => {
  if (!isRecord(error)) return undefined;

  const data = getResponseData(error);

  if (typeof data === "string") {
    return nonEmptyString(data);
  }

  const validationMessage = getValidationMessage(data);

  if (validationMessage) {
    return validationMessage;
  }

  if (isRecord(data)) {
    const message = nonEmptyString(data.error);

    if (message) {
      return message;
    }
  }

  return nonEmptyString(error.message);
};

export const extractServerErrorMessage = (
  error: unknown,
  fallback: string = DEFAULT_FALLBACK,
): string => getErrorMessage(error) ?? fallback;

const getErrorStatus = (error: unknown): number | undefined => {
  if (!isRecord(error) || !isRecord(error.response)) return undefined;
  const { status } = error.response;
  return typeof status === "number" ? status : undefined;
};

export const extractServerError = (
  error: unknown,
  fallback?: string,
): { error: string; status?: number } => {
  const fallbackMessage = fallback ?? DEFAULT_FALLBACK;
  const message = extractServerErrorMessage(error, fallbackMessage);
  const status = getErrorStatus(error);

  // A 5xx body can contain SQL/stack text. Log it for support, never render it.
  if (status !== undefined && status >= 500) {
    console.error("Backend server error:", message);
    return { error: fallbackMessage, status };
  }

  // Network/timeout failures have no status and no useful admin-facing text.
  if (status === undefined) {
    console.error("Backend request failed:", message);
    return { error: fallbackMessage };
  }

  return { error: message, status };
};
