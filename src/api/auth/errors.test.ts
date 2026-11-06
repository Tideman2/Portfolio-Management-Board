import { describe, expect, it } from "vitest";

import {
  isInvalidCredentialsError,
  isSessionAuthError,
} from "@/api/auth/errors";

const responseError = (status: number, body: unknown) => ({
  response: { status, data: body },
});

describe("isSessionAuthError", () => {
  it("treats a 401 as a session failure", () => {
    expect(isSessionAuthError(responseError(401, {}))).toBe(true);
  });

  it("treats a 403 as a session failure", () => {
    expect(isSessionAuthError(responseError(403, {}))).toBe(true);
  });

  it("ignores validation and conflict errors", () => {
    expect(isSessionAuthError(responseError(400, {}))).toBe(false);
    expect(isSessionAuthError(responseError(409, {}))).toBe(false);
    expect(isSessionAuthError({ message: "timeout" })).toBe(false);
  });
});

describe("isInvalidCredentialsError", () => {
  it("detects the login 401", () => {
    expect(
      isInvalidCredentialsError(
        responseError(401, { error: "Invalid credentials" }),
      ),
    ).toBe(true);
  });

  it("does not match other 401 responses", () => {
    expect(
      isInvalidCredentialsError(
        responseError(401, { error: "Missing token" }),
      ),
    ).toBe(false);
  });
});
