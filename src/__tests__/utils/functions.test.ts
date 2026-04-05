import {
  queryParamToNumberArray,
  getFilterDefaultsFromQuery,
  getFormattedPrice,
  getFormattedPricePsf,
  getUserInitials,
  safeParseFloat,
  stableStringify,
  capitalizeFirstLetter,
  formatFilterSummary,
  getListingsData,
} from "@/utils/functions";
import type { ParsedUrlQuery } from "querystring";
import type { ListingFilter } from "@/utils/types";

// ─── queryParamToNumberArray ──────────────────────────────────────────────────

describe("queryParamToNumberArray", () => {
  it("returns [] when param is undefined", () => {
    expect(queryParamToNumberArray(undefined)).toEqual([]);
  });

  it("wraps a single numeric string in an array", () => {
    expect(queryParamToNumberArray("2")).toEqual([2]);
  });

  it("returns [] for a non-numeric string", () => {
    expect(queryParamToNumberArray("abc")).toEqual([]);
  });

  it("converts an array of numeric strings to numbers", () => {
    expect(queryParamToNumberArray(["1", "2", "3"])).toEqual([1, 2, 3]);
  });

  it("silently drops non-numeric values from an array", () => {
    expect(queryParamToNumberArray(["1", "abc", "3"])).toEqual([1, 3]);
  });

  it("handles an array of all non-numeric values", () => {
    expect(queryParamToNumberArray(["abc", "xyz"])).toEqual([]);
  });
});

// ─── getFilterDefaultsFromQuery ───────────────────────────────────────────────

describe("getFilterDefaultsFromQuery", () => {
  it("returns empty defaults when query is empty", () => {
    const result = getFilterDefaultsFromQuery({});
    expect(result.minPrice).toBeUndefined();
    expect(result.maxPrice).toBeUndefined();
    expect(result.categories).toBeUndefined();
    expect(result.types).toEqual([]);
    expect(result.bedRooms).toEqual([]);
    expect(result.bathRooms).toEqual([]);
    expect(result.furnishings).toEqual([]);
  });

  it("parses all present params correctly", () => {
    const query: ParsedUrlQuery = {
      minPrice: "500",
      maxPrice: "2000",
      categories: "residential",
      types: ["apartment", "condo"],
      bedRooms: ["1", "2"],
      bathRooms: "2",
      furnishings: "fully-furnished",
    };
    const result = getFilterDefaultsFromQuery(query);
    expect(result.minPrice).toBe(500);
    expect(result.maxPrice).toBe(2000);
    expect(result.categories).toBe("residential");
    expect(result.types).toEqual(["apartment", "condo"]);
    expect(result.bedRooms).toEqual([1, 2]);
    expect(result.bathRooms).toEqual([2]);
    expect(result.furnishings).toEqual(["fully-furnished"]);
  });

  it("wraps a single `types` string in an array", () => {
    const result = getFilterDefaultsFromQuery({ types: "apartment" });
    expect(result.types).toEqual(["apartment"]);
  });

  it("ignores non-numeric minPrice/maxPrice", () => {
    const result = getFilterDefaultsFromQuery({
      minPrice: "notanumber",
      maxPrice: "alsonotanumber",
    });
    expect(result.minPrice).toBeUndefined();
    expect(result.maxPrice).toBeUndefined();
  });

  it("ignores array categories (must be a string)", () => {
    const result = getFilterDefaultsFromQuery({
      categories: ["residential", "condo"],
    });
    expect(result.categories).toBeUndefined();
  });
});

// ─── getFormattedPrice ────────────────────────────────────────────────────────

describe("getFormattedPrice", () => {
  it("formats a price with RM prefix and locale separators", () => {
    expect(getFormattedPrice(1500000)).toBe("RM 1,500,000");
  });

  it("formats small prices", () => {
    expect(getFormattedPrice(1000)).toBe("RM 1,000");
  });
});

// ─── getFormattedPricePsf ─────────────────────────────────────────────────────

describe("getFormattedPricePsf", () => {
  it("calculates price per square foot correctly", () => {
    expect(getFormattedPricePsf("1000", 500000)).toBe("RM 500.00 psf");
  });

  it("avoids floating-point drift on non-round results", () => {
    // 100000 / 3 = 33333.333... — should render exactly 2 decimal places
    expect(getFormattedPricePsf("3", 100000)).toBe("RM 33333.33 psf");
  });
});

// ─── getUserInitials ──────────────────────────────────────────────────────────

describe("getUserInitials", () => {
  it("returns two uppercase initials for a two-word name", () => {
    expect(getUserInitials("John Doe")).toBe("JD");
  });

  it("returns one uppercase initial for a single-word name", () => {
    expect(getUserInitials("Madonna")).toBe("M");
  });

  it("uses the first two words of a multi-word name", () => {
    expect(getUserInitials("Mary Jane Watson")).toBe("MJ");
  });
});

// ─── safeParseFloat ───────────────────────────────────────────────────────────

describe("safeParseFloat", () => {
  it("parses a valid float string", () => {
    expect(safeParseFloat("3.14")).toBe(3.14);
  });

  it("returns undefined for a non-numeric string", () => {
    expect(safeParseFloat("abc")).toBeUndefined();
  });

  it("parses an integer string", () => {
    expect(safeParseFloat("42")).toBe(42);
  });
});

// ─── stableStringify ──────────────────────────────────────────────────────────

describe("stableStringify", () => {
  it("produces identical output regardless of key insertion order", () => {
    const a = { b: 1, a: 2 };
    const b = { a: 2, b: 1 };
    expect(stableStringify(a)).toBe(stableStringify(b));
  });

  it("handles nested objects with consistent key order", () => {
    const x = { z: { b: 1, a: 2 }, y: 3 };
    const y = { y: 3, z: { a: 2, b: 1 } };
    expect(stableStringify(x)).toBe(stableStringify(y));
  });

  it("handles arrays as values", () => {
    expect(stableStringify({ a: [3, 1, 2] })).toBe('{"a":[3,1,2]}');
  });

  it("handles null", () => {
    expect(stableStringify(null)).toBe("null");
  });

  it("handles primitive values directly", () => {
    expect(stableStringify("hello")).toBe('"hello"');
    expect(stableStringify(42)).toBe("42");
  });
});

// ─── capitalizeFirstLetter ────────────────────────────────────────────────────

describe("capitalizeFirstLetter", () => {
  it("capitalizes the first letter", () => {
    expect(capitalizeFirstLetter("rent")).toBe("Rent");
  });

  it("does not change an already-capitalized word", () => {
    expect(capitalizeFirstLetter("Sale")).toBe("Sale");
  });
});

// ─── formatFilterSummary ──────────────────────────────────────────────────────

describe("formatFilterSummary", () => {
  it("builds primary text with section, state, and city", () => {
    const filter: ListingFilter = {
      id: "abc",
      section: "rent",
      state: "Selangor",
      city: "Petaling Jaya",
    };
    const { primary } = formatFilterSummary(filter);
    expect(primary).toBe("Rent • Selangor • Petaling Jaya");
  });

  it("defaults section to Sale when absent", () => {
    const filter: ListingFilter = { id: "abc" };
    const { primary } = formatFilterSummary(filter);
    expect(primary).toBe("Sale");
  });

  it("builds secondary text with search keyword", () => {
    const filter: ListingFilter = {
      id: "abc",
      q: "KLCC",
      categories: "residential",
    };
    const { secondary } = formatFilterSummary(filter);
    expect(secondary).toContain('Search: "KLCC"');
  });

  it("shows All Properties when categories is absent", () => {
    const filter: ListingFilter = { id: "abc" };
    const { secondary } = formatFilterSummary(filter);
    expect(secondary).toContain("All Properties");
  });

  it("shows capitalized category when present", () => {
    const filter: ListingFilter = { id: "abc", categories: "residential" };
    const { secondary } = formatFilterSummary(filter);
    expect(secondary).toContain("Residential");
  });
});

// ─── getListingsData (SSR function) ──────────────────────────────────────────

describe("getListingsData", () => {
  const mockListingsResponse = {
    items: [],
    _links: { self: {}, first: {}, last: {} },
    _meta: { totalCount: 0, pageCount: 1, currentPage: 1, perPage: 20 },
  };

  function makeCtx(query: ParsedUrlQuery = {}) {
    return {
      query,
      req: {},
      res: { setHeader: jest.fn() },
      params: {},
      resolvedUrl: "/",
    } as any;
  }

  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify(mockListingsResponse));
  });

  it("defaults to page=1, sort=createdAt, section=sale", async () => {
    await getListingsData(makeCtx({}));

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("page=1");
    expect(url).toContain("sort=createdAt");

    const body = JSON.parse(options!.body as string);
    expect(body.section).toBe("sale");
  });

  it("uses section=rent when query has section=rent", async () => {
    await getListingsData(makeCtx({ section: "rent" }));

    const body = JSON.parse(fetchMock.mock.calls[0][1]!.body as string);
    expect(body.section).toBe("rent");
  });

  it("falls back to section=sale for an invalid section value", async () => {
    await getListingsData(makeCtx({ section: "unknown" }));

    const body = JSON.parse(fetchMock.mock.calls[0][1]!.body as string);
    expect(body.section).toBe("sale");
  });

  it("includes city in POST body and omits state when both provided", async () => {
    await getListingsData(makeCtx({ city: "Kuala Lumpur", state: "Selangor" }));

    const body = JSON.parse(fetchMock.mock.calls[0][1]!.body as string);
    expect(body.city).toBe("Kuala Lumpur");
    expect(body.state).toBeUndefined();
  });

  it("includes state in POST body when only state provided", async () => {
    await getListingsData(makeCtx({ state: "Selangor" }));

    const body = JSON.parse(fetchMock.mock.calls[0][1]!.body as string);
    expect(body.state).toBe("Selangor");
    expect(body.city).toBeUndefined();
  });

  it("throws when the API responds with a non-ok status", async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce("Error", { status: 503 });

    await expect(getListingsData(makeCtx({}))).rejects.toThrow(
      "Failed to fetch listings: 503"
    );
  });
});
