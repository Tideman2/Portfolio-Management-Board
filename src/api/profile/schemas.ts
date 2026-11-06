import { z } from "zod";

/**
 * The contract rejects `null` and treats an omitted field as "unchanged".
 * Empty form values are therefore dropped rather than sent as "".
 */
const optionalText = (max: number, message: string) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().max(max, message).optional(),
  );

/** `YYYY-MM-DD`, and a real calendar date (rejects 2026-02-31). */
export const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use the YYYY-MM-DD format.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(date.getTime()) &&
      date.toISOString().startsWith(value)
    );
  }, "Enter a valid date.");

export const profileUpdateSchema = z.object({
  name: optionalText(120, "Name must be at most 120 characters."),
  date_of_birth: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    isoDateSchema.optional(),
  ),
  country: optionalText(80, "Country must be at most 80 characters."),
  bio: optionalText(2000, "Bio must be at most 2000 characters."),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
