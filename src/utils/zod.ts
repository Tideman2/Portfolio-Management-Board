import type { ZodError } from "zod";

export type FieldErrors = Record<string, string>;

/**
 * Maps the first Zod issue for each top-level field to a form-friendly record.
 */
export const toFieldErrors = (error: ZodError): FieldErrors => {
  const errors: FieldErrors = {};

  for (const issue of error.issues) {
    const key = issue.path[0];

    if (typeof key === "string" && errors[key] === undefined) {
      errors[key] = issue.message;
    }
  }

  return errors;
};
