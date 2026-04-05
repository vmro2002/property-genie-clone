import { renderHook, act } from "@testing-library/react";
import { useListingsSort } from "@/hooks/useListingsSort";
import mockRouter from "next-router-mock";

beforeEach(() => {
  mockRouter.setCurrentUrl("/");
});

describe("useListingsSort", () => {
  it("defaults selectedSort to 'createdAt' when no sort param in URL", () => {
    const { result } = renderHook(() => useListingsSort());
    expect(result.current.selectedSort).toBe("createdAt");
  });

  it("reads selectedSort from the URL sort param", () => {
    mockRouter.setCurrentUrl("/?sort=price");
    const { result } = renderHook(() => useListingsSort());
    expect(result.current.selectedSort).toBe("price");
  });

  it("handleSortChange pushes sort param and resets page to 1", () => {
    mockRouter.setCurrentUrl("/?page=3");
    const { result } = renderHook(() => useListingsSort());

    act(() => {
      result.current.handleSortChange("-price");
    });

    expect(mockRouter.query.sort).toBe("-price");
    expect(mockRouter.query.page).toBe(1);
  });

  it("handleSortChange preserves other query params", () => {
    mockRouter.setCurrentUrl("/?section=rent&categories=residential");
    const { result } = renderHook(() => useListingsSort());

    act(() => {
      result.current.handleSortChange("-createdAt");
    });

    expect(mockRouter.query.section).toBe("rent");
    expect(mockRouter.query.categories).toBe("residential");
    expect(mockRouter.query.sort).toBe("-createdAt");
  });

  it("clearSort removes the sort param and resets page to 1", () => {
    mockRouter.setCurrentUrl("/?sort=-price&page=2&section=sale");
    const { result } = renderHook(() => useListingsSort());

    act(() => {
      result.current.clearSort();
    });

    expect(mockRouter.query.sort).toBeUndefined();
    expect(mockRouter.query.page).toBe(1);
  });

  it("clearSort preserves other query params", () => {
    mockRouter.setCurrentUrl("/?sort=price&section=rent&categories=condo");
    const { result } = renderHook(() => useListingsSort());

    act(() => {
      result.current.clearSort();
    });

    expect(mockRouter.query.section).toBe("rent");
    expect(mockRouter.query.categories).toBe("condo");
    expect(mockRouter.query.sort).toBeUndefined();
  });
});
