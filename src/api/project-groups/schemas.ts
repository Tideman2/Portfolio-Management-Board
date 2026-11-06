import { z } from "zod";

export const projectGroupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter the group name.")
    .max(100, "Group name must be at most 100 characters."),
});

export type ProjectGroupInputSchema = z.infer<typeof projectGroupSchema>;
