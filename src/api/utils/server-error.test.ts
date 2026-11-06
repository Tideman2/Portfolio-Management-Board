import { afterEach, describe, expect, it, vi } from "vitest";

import { extractFieldErrors, extractServerError } from "@/api/utils/server-error";

describe("extractServerError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("hides a 5xx body but logs it on the server", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = extractServerError(
      { response: { status: 500, data: { error: "SQL secret" } } },
      "Generic failure.",
    );

    expect(result).toEqual({ error: "Generic failure.", status: 500 });
    expect(log).toHaveBeenCalledWith("Backend server error:", "SQL secret");
  });

  it("passes the contract error string through", () => {
    const result = extractServerError(
      {
        response: {
          status: 409,
          data: { error: "Group name already exists" },
        },
      },
      "Generic failure.",
    );

    expect(result).toEqual({ error: "Group name already exists", status: 409 });
  });

  it("formats the first validation error as field: message", () => {
    const result = extractServerError(
      {
        response: {
          status: 400,
          data: { errors: { date_of_birth: ["Invalid date format."] } },
        },
      },
      "Generic failure.",
    );

    expect(result).toEqual({
      error: "date_of_birth: Invalid date format.",
      status: 400,
    });
  });

  it("uses the fallback for network failures without a status", () => {
    const log = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = extractServerError(
      { message: "timeout of 0ms exceeded" },
      "Generic failure.",
    );

    expect(result).toEqual({ error: "Generic failure." });
    expect(log).toHaveBeenCalledWith(
      "Backend request failed:",
      "timeout of 0ms exceeded",
    );
  });
});

describe("extractFieldErrors", () => {
  it("maps the first message per field", () => {
    expect(
      extractFieldErrors({
        response: {
          status: 400,
          data: {
            errors: {
              name: ["Name is required.", "Name is too long."],
              url: ["Enter a valid URL."],
            },
          },
        },
      }),
    ).toEqual({
      name: "Name is required.",
      url: "Enter a valid URL.",
    });
  });

  it("ignores malformed entries", () => {
    expect(
      extractFieldErrors({
        response: {
          status: 400,
          data: {
            errors: {
              name: "not-an-array",
              bio: [],
              country: [""],
            },
          },
        },
      }),
    ).toBeUndefined();
  });

  it("returns undefined when the body has no errors object", () => {
    expect(
      extractFieldErrors({
        response: { status: 409, data: { error: "Group is not empty" } },
      }),
    ).toBeUndefined();
  });
});
