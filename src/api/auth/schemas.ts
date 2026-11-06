import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Enter your username."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export type LoginInput = z.infer<typeof loginSchema>;
