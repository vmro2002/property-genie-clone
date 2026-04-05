/**
 * API endpoint for searching locations
 * This is handled server-side to avoid CORS issues
 */
import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINT } from "@/utils/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { keyword } = req.query;

  if (!keyword || typeof keyword !== "string") {
    return res.status(422).json({ error: "keyword is required" });
  }

  try {
    const response = await fetch(
      `${API_ENDPOINT}/locations-mock?keyword=${encodeURIComponent(keyword)}`,
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Upstream request failed" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
}
