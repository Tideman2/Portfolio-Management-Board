import { z } from "zod";

import {
  MAX_PROJECT_IMAGE_BYTES,
} from "@/api/projects/types";

const requiredText = (max: number, message: string) =>
  z.string().trim().min(1, "This field is required.").max(max, message);

const urlField = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(2048, "URL is too long.")
  .url("Enter a valid URL, for example https://example.com.")
  .refine(
    (value) => /^https?:\/\//i.test(value),
    "URL must start with http:// or https://.",
  );

const imageField = z
  .custom<File>((value) => typeof File !== "undefined" && value instanceof File)
  .refine(
    (file) => file.size <= MAX_PROJECT_IMAGE_BYTES,
    "Image must be 5 MB or smaller.",
  )
  .refine(
    (file) => file.type.startsWith("image/"),
    "Choose an image file.",
  )
  .optional();

export const projectSchema = z.object({
  title: requiredText(150, "Title must be at most 150 characters."),
  stack: requiredText(255, "Stack must be at most 255 characters."),
  goal: requiredText(1000, "Goal must be at most 1000 characters."),
  github_url: urlField,
  demo_url: urlField,
  group_id: z
    .number()
    .int("Choose a project group.")
    .positive("Choose a project group."),
  image: imageField,
});

export type ProjectSchemaInput = z.infer<typeof projectSchema>;
