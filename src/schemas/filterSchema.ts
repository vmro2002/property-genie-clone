import { z } from "zod";

export const filterSchema = z
  .object({
    minPrice: z.number().min(1, "Min price must be greater than 0").optional(),
    maxPrice: z.number().optional(),
    categories: z.string().optional(),
    types: z.array(z.string()).optional(),
    bedRooms: z.array(z.number()).optional(),
    bathRooms: z.array(z.number()).optional(),
    furnishings: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice && data.minPrice > data.maxPrice) {
        return false;
      }
      return true;
    },
    {
      path: ["minPrice"],
      message: "Minimum price must be less than maximum price",
    },
  );

export type FilterFormValues = z.infer<typeof filterSchema>;
