import { z } from "zod";

export const socialSchema = z.object({
  platform_name: z
    .string()
    .trim()
    .min(1, "Enter the platform name.")
    .max(50, "Platform name must be at most 50 characters."),
  url: z
    .string()
    .trim()
    .min(1, "Enter the profile URL.")
    .max(2048, "URL is too long.")
    .url("Enter a valid URL, for example https://github.com/you.")
    .refine(
      (value) => /^https?:\/\//i.test(value),
      "URL must start with http:// or https://.",
    ),
});

export type SocialInputSchema = z.infer<typeof socialSchema>;
