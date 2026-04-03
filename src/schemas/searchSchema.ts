import { z } from "zod";

export const searchSchema = z.object({
  q: z.string().min(1),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
