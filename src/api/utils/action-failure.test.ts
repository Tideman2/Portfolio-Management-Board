import { afterEach, describe, expect, it, vi } from "vitest";

import { toActionFailure } from "@/api/utils/action-failure";

const responseError = (status: number, body: unknown) => ({
  response: { status, data: body },
});

describe("toActionFailure", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("marks a session 401 as expired", () => {
    expect(
      toActionFailure(responseError(401, {}), "Generic failure."),
    ).toEqual({
      success: false,
      error: "Your session has ended. Sign in again.",
      status: 401,
      sessionExpired: true,
    });
  });

  it("marks a 403 as expired", () => {
    expect(
      toActionFailure(responseError(403, {}), "Generic failure."),
    ).toMatchObject({ success: false, sessionExpired: true });
  });

  it("uses the fallback for a 5xx and does not mark it as a session failure", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = toActionFailure(
      responseError(500, { error: "SQL secret" }),
      "Generic failure.",
    );

    expect(result).toMatchObject({
      success: false,
      error: "Generic failure.",
      status: 500,
    });
    expect(result.success).toBe(false);
    expect(result.sessionExpired).toBeUndefined();
  });

  it("passes a 409 message through", () => {
    expect(
      toActionFailure(
        responseError(409, { error: "Group name already exists" }),
        "Generic failure.",
      ),
    ).toEqual({
      success: false,
      error: "Group name already exists",
      status: 409,
    });
  });

  it("maps contract validation errors for inline fields", () => {
    expect(
      toActionFailure(
        responseError(400, { errors: { url: ["Enter a valid URL."] } }),
        "Generic failure.",
      ),
    ).toMatchObject({
      success: false,
      status: 400,
      fieldErrors: { url: "Enter a valid URL." },
    });
  });

  it("does not expose field errors from a 5xx body", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    const result = toActionFailure(
      responseError(500, { errors: { name: ["SQL detail"] } }),
      "Generic failure.",
    );

    expect(result.success).toBe(false);
    expect(result.fieldErrors).toBeUndefined();
  });
});
