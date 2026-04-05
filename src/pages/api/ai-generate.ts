import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { aiGenerationSchema } from "@/schemas/aiGenerationSchema";
import { aiDescriptionSchema } from "@/schemas/aiDescriptionSchema";
import { zodTextFormat } from "openai/helpers/zod";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a real estate search assistant for a Malaysian property listing platform.

Convert the user's natural language description into structured search parameters.

Rules:
- section: "rent" for rental properties, "sale" for properties to buy
- categories: one of "residential", "condo", "flat", "room"
- minPrice and maxPrice: monthly rent in RM for rent, purchase price in RM for sale. Use 0 if not mentioned.
- bedRooms: array of bedroom counts the user wants (0=studio, 1-5). Empty array if not mentioned.
- bathRooms: array of bathroom counts the user wants (1-5). Empty array if not mentioned.
- furnishings: array from ["unfurnished", "partially-furnished", "fully-furnished"]. Empty array if not mentioned.

Default to "sale" if the intent is unclear.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const validation = aiDescriptionSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(422).json({
      error: validation.error.issues[0]?.message ?? "Invalid request",
    });
  }

  const { description } = validation.data;

  try {
    const response = await client.responses.parse({
      model: "gpt-4o-mini",
      input: [
        {
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: description
        }
      ],
      text: {
        format: zodTextFormat(aiGenerationSchema, "property_search"),
      }
     
    });

    const result = response.output_parsed;

    return res.status(200).json(result);
  } catch {
    return res.status(500).json({ error: "Failed to generate search parameters. Please try again." });
  }
}
