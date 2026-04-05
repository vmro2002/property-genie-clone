import { z } from "zod";

export const aiGenerationSchema = z.object({
  section: z.enum(["rent", "sale"]),
  minPrice: z.number(),
  maxPrice: z.number(),
  categories: z.enum(["residential", "condo", "flat", "room"]),
  bedRooms: z.array(z.number().min(0).max(5)),
  bathRooms: z.array(z.number().min(1).max(5)),
  furnishings: z.array(
    z.enum(["unfurnished", "partially-furnished", "fully-furnished"]),
  ),
});

export type AiGenerationValues = z.infer<typeof aiGenerationSchema>;
