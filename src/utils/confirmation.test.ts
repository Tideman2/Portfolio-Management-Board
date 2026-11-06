import { describe, expect, it } from "vitest";

import { isConfirmationMatch } from "@/utils/confirmation";

describe("isConfirmationMatch", () => {
  it("accepts the exact expected value", () => {
    expect(isConfirmationMatch("user@example.com", "user@example.com")).toBe(
      true,
    );
  });

  it("ignores surrounding whitespace", () => {
    expect(
      isConfirmationMatch(" user@example.com ", "  user@example.com  "),
    ).toBe(true);
  });

  it("is case-sensitive", () => {
    expect(isConfirmationMatch("User@example.com", "user@example.com")).toBe(
      false,
    );
  });

  it("rejects empty input", () => {
    expect(isConfirmationMatch("user@example.com", "")).toBe(false);
    expect(isConfirmationMatch("user@example.com", "   ")).toBe(false);
  });
});
