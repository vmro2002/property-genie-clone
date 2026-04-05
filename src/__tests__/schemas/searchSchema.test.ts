import { searchSchema } from "@/schemas/searchSchema";

describe("searchSchema", () => {
  it("passes for a non-empty search string", () => {
    const result = searchSchema.safeParse({ q: "Kuala Lumpur" });
    expect(result.success).toBe(true);
  });

  it("rejects an empty string — prevents empty search submissions", () => {
    const result = searchSchema.safeParse({ q: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === "q");
      expect(issue).toBeDefined();
    }
  });

  it("rejects a missing q field", () => {
    const result = searchSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
