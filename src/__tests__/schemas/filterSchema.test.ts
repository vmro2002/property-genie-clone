import { filterSchema } from "@/schemas/filterSchema";

describe("filterSchema", () => {
  it("passes with a valid, fully-populated filter", () => {
    const result = filterSchema.safeParse({
      minPrice: 100,
      maxPrice: 5000,
      categories: "residential",
      types: ["apartment", "condo"],
      bedRooms: [1, 2],
      bathRooms: [1],
      furnishings: ["fully-furnished"],
    });
    expect(result.success).toBe(true);
  });

  it("passes when all optional fields are absent", () => {
    const result = filterSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects minPrice below 1", () => {
    const result = filterSchema.safeParse({ minPrice: 0 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path[0]);
      expect(paths).toContain("minPrice");
    }
  });

  it("rejects when minPrice is greater than maxPrice", () => {
    const result = filterSchema.safeParse({ minPrice: 5000, maxPrice: 1000 });
    expect(result.success).toBe(false);
    if (!result.success) {
      // The refinement sets path: ["minPrice"]
      const issue = result.error.issues.find((i) => i.path[0] === "minPrice");
      expect(issue).toBeDefined();
      expect(issue?.message).toMatch(/less than maximum/i);
    }
  });

  it("passes when minPrice equals maxPrice (boundary: > not >=)", () => {
    const result = filterSchema.safeParse({ minPrice: 1000, maxPrice: 1000 });
    expect(result.success).toBe(true);
  });

  it("passes when only minPrice is set (maxPrice absent)", () => {
    const result = filterSchema.safeParse({ minPrice: 500 });
    expect(result.success).toBe(true);
  });

  it("passes when only maxPrice is set (minPrice absent)", () => {
    const result = filterSchema.safeParse({ maxPrice: 5000 });
    expect(result.success).toBe(true);
  });
});
