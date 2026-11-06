import { describe, expect, it } from "vitest";

import {
  extractErrorMessage,
  formatDate,
  formatDateTime,
  parseServerDate,
} from "@/utils/display";

describe("parseServerDate", () => {
  it("treats a naive backend timestamp as UTC wall-clock time", () => {
    expect(parseServerDate("2026-10-23T00:30:00").toISOString()).toBe(
      "2026-10-23T00:30:00.000Z",
    );
  });

  it("preserves an explicit UTC designator", () => {
    expect(parseServerDate("2026-10-23T10:15:30Z").toISOString()).toBe(
      "2026-10-23T10:15:30.000Z",
    );
  });

  it("preserves an explicit offset", () => {
    expect(parseServerDate("2026-10-23T10:15:30+02:00").toISOString()).toBe(
      "2026-10-23T08:15:30.000Z",
    );
  });
});

describe("formatDate", () => {
  it("formats an ISO date", () => {
    expect(formatDate("2026-10-23")).toBe("Oct 23, 2026");
  });

  it("renders invalid and missing dates as an em dash", () => {
    expect(formatDate("not-a-date")).toBe("—");
    expect(formatDate(null)).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("formats a naive server datetime in UTC", () => {
    expect(formatDateTime("2026-10-23T10:15:30")).toBe(
      "Oct 23, 2026, 10:15 AM",
    );
  });

  it("renders invalid datetimes as an em dash", () => {
    expect(formatDateTime("not-a-date")).toBe("—");
  });
});

describe("extractErrorMessage", () => {
  it("reads the contract error string", () => {
    expect(
      extractErrorMessage({ data: { error: "Invalid credentials" } }),
    ).toBe("Invalid credentials");
  });

  it("falls back for unknown errors", () => {
    expect(extractErrorMessage(null, "Fallback")).toBe("Fallback");
  });
});
