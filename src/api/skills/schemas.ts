import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter the skill name.")
    .max(80, "Skill name must be at most 80 characters."),
  description: z
    .string()
    .trim()
    .min(1, "Describe the skill.")
    .max(500, "Description must be at most 500 characters."),
  proficiency: z
    .number()
    .int("Choose a whole number from 1 to 5.")
    .min(1, "Proficiency must be between 1 and 5.")
    .max(5, "Proficiency must be between 1 and 5."),
});

export type SkillInputSchema = z.infer<typeof skillSchema>;
