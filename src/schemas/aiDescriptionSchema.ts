import { z } from "zod";

export const aiDescriptionSchema = z.object({
  description: z
    .string()
    .min(1, "Please enter a description")
    .max(256, "Description must be 256 characters or fewer"),
});

export type AiDescriptionValues = z.infer<typeof aiDescriptionSchema>;
