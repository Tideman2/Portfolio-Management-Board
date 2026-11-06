/**
 * Pure display helpers for dates and error messages.
 *
 * This module is safe to import from client or server components: it has no
 * React, API, or server-only dependencies.
 */

const EMPTY_VALUE = "—";
const DEFAULT_LOCALE = "en-US";

/**
 * Matches an ISO date-time with no timezone designator, e.g.
 * `2026-10-23T10:15:30` or `2026-10-23 10:15:30.123456`.
 */
const NAIVE_ISO_DATETIME =
  /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/;

/**
 * Parses a backend date value without shifting naive timestamps.
 *
 * Naive values are server wall-clock time, so appending `Z` makes JavaScript
 * read the same clock digits instead of assuming the browser's timezone.
 * Values that already carry `Z` or an offset are unchanged.
 */
export function parseServerDate(value: string | number | Date): Date {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "number") {
    return new Date(value);
  }

  const trimmed = value.trim();

  if (NAIVE_ISO_DATETIME.test(trimmed)) {
    const normalized = trimmed
      .replace(" ", "T")
      .replace(/(\.\d{3})\d+$/, "$1");

    return new Date(`${normalized}Z`);
  }

  return new Date(trimmed);
}

/**
 * Formats a date with `en-US` conventions, defaulting to
 * `{ year: "numeric", month: "short", day: "2-digit", timeZone: "UTC" }`.
 * Invalid or missing dates render as "—".
 */
export function formatDate(
  value: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const date = parseServerDate(value);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_VALUE;
  }

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
    ...options,
  }).format(date);
}

/**
 * Formats a date and time with `en-US` conventions. Invalid or missing values
 * render as "—".
 */
export function formatDateTime(
  value: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (value === null || value === undefined || value === "") {
    return EMPTY_VALUE;
  }

  const date = parseServerDate(value);

  if (Number.isNaN(date.getTime())) {
    return EMPTY_VALUE;
  }

  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    ...options,
  }).format(date);
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim().length > 0 ? value : null;
}

/**
 * Extracts a human-readable message from an unknown thrown/rejected value.
 *
 * Checks `error.data.error`, then `error.data.message`, then `error.message`,
 * and finally falls back to the provided message.
 */
export function extractErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (isRecord(error)) {
    const data = error.data;

    if (isRecord(data)) {
      const apiError = asNonEmptyString(data.error);

      if (apiError !== null) {
        return apiError;
      }

      const dataMessage = asNonEmptyString(data.message);

      if (dataMessage !== null) {
        return dataMessage;
      }
    }

    const errorMessage = asNonEmptyString(error.message);

    if (errorMessage !== null) {
      return errorMessage;
    }
  }

  return fallback;
}
