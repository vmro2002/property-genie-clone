import { renderHook, act } from "@testing-library/react";
import { useFilterForm } from "@/hooks/useFilterForm";
import mockRouter from "next-router-mock";

beforeEach(() => {
  mockRouter.setCurrentUrl("/");
});

describe("useFilterForm — activeFilterCount", () => {
  it("is 0 with no filter query params", () => {
    mockRouter.setCurrentUrl("/");
    const { result } = renderHook(() => useFilterForm());
    expect(result.current.activeFilterCount).toBe(0);
  });

  it("counts each distinct filter param as +1", () => {
    mockRouter.setCurrentUrl(
      "/?minPrice=500&maxPrice=2000&categories=residential&types=apartment&bedRooms=2&bathRooms=1&furnishings=fully-furnished"
    );
    const { result } = renderHook(() => useFilterForm());
    // 7 filter params = 7
    expect(result.current.activeFilterCount).toBe(7);
  });

  it("counts only the params that are present", () => {
    mockRouter.setCurrentUrl("/?categories=residential&bedRooms=1");
    const { result } = renderHook(() => useFilterForm());
    expect(result.current.activeFilterCount).toBe(2);
  });
});

describe("useFilterForm — togglePropertyType", () => {
  it("adds a type that is not currently selected", () => {
    mockRouter.setCurrentUrl("/");
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.togglePropertyType("apartment");
    });

    expect(result.current.propertyTypes).toContain("apartment");
  });

  it("removes a type that is already selected", () => {
    mockRouter.setCurrentUrl("/?types=apartment");
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.togglePropertyType("apartment");
    });

    expect(result.current.propertyTypes).not.toContain("apartment");
  });

  it("preserves other selected types when toggling one", () => {
    mockRouter.setCurrentUrl("/?types=apartment&types=condo");
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.togglePropertyType("apartment");
    });

    expect(result.current.propertyTypes).not.toContain("apartment");
    expect(result.current.propertyTypes).toContain("condo");
  });
});

describe("useFilterForm — toggleBedrooms", () => {
  it("adds a bedroom count not currently selected", () => {
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.toggleBedrooms(2);
    });

    expect(result.current.bedRooms).toContain(2);
  });

  it("removes a bedroom count that is already selected", () => {
    mockRouter.setCurrentUrl("/?bedRooms=2");
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.toggleBedrooms(2);
    });

    expect(result.current.bedRooms).not.toContain(2);
  });
});

describe("useFilterForm — toggleBathrooms", () => {
  it("adds a bathroom count not currently selected", () => {
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.toggleBathrooms(1);
    });

    expect(result.current.bathRooms).toContain(1);
  });

  it("removes a bathroom count that is already selected", () => {
    mockRouter.setCurrentUrl("/?bathRooms=1");
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.toggleBathrooms(1);
    });

    expect(result.current.bathRooms).not.toContain(1);
  });
});

describe("useFilterForm — toggleFurnishings", () => {
  it("adds a furnishing option not currently selected", () => {
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.toggleFurnishings("fully-furnished");
    });

    expect(result.current.furnishings).toContain("fully-furnished");
  });

  it("removes a furnishing option that is already selected", () => {
    mockRouter.setCurrentUrl("/?furnishings=fully-furnished");
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.toggleFurnishings("fully-furnished");
    });

    expect(result.current.furnishings).not.toContain("fully-furnished");
  });
});

describe("useFilterForm — showPropertyTypes", () => {
  it("is false when categories is not 'residential'", () => {
    mockRouter.setCurrentUrl("/?categories=condo");
    const { result } = renderHook(() => useFilterForm());
    expect(result.current.showPropertyTypes).toBe(false);
  });

  it("is true when categories is 'residential'", () => {
    mockRouter.setCurrentUrl("/?categories=residential");
    const { result } = renderHook(() => useFilterForm());
    expect(result.current.showPropertyTypes).toBe(true);
  });

  it("is false when categories is absent", () => {
    mockRouter.setCurrentUrl("/");
    const { result } = renderHook(() => useFilterForm());
    expect(result.current.showPropertyTypes).toBe(false);
  });
});

describe("useFilterForm — clearFilters", () => {
  it("removes all filter params from the URL", () => {
    mockRouter.setCurrentUrl(
      "/?minPrice=500&maxPrice=2000&categories=residential&page=2"
    );
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.clearFilters();
    });

    expect(mockRouter.query.minPrice).toBeUndefined();
    expect(mockRouter.query.maxPrice).toBeUndefined();
    expect(mockRouter.query.categories).toBeUndefined();
  });

  it("preserves non-filter params like q and section", () => {
    mockRouter.setCurrentUrl("/?q=KLCC&section=rent&minPrice=500");
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.clearFilters();
    });

    expect(mockRouter.query.q).toBe("KLCC");
    expect(mockRouter.query.section).toBe("rent");
    expect(mockRouter.query.minPrice).toBeUndefined();
  });

  it("resets page to 1", () => {
    mockRouter.setCurrentUrl("/?minPrice=500&page=5");
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.clearFilters();
    });

    expect(mockRouter.query.page).toBe(1);
  });
});

describe("useFilterForm — handleCloseFilter", () => {
  it("closes the filter modal", () => {
    const { result } = renderHook(() => useFilterForm());

    act(() => {
      result.current.setFilterOpen(true);
    });
    expect(result.current.filterOpen).toBe(true);

    act(() => {
      result.current.handleCloseFilter();
    });
    expect(result.current.filterOpen).toBe(false);
  });
});
