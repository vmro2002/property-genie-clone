import { renderHook, act, waitFor } from "@testing-library/react";
import { useFilterSave } from "@/hooks/useFilterSave";
import mockRouter from "next-router-mock";

// next-router-mock is mapped globally via jest.config.ts

const STORAGE_KEY = "property-genie-saved-filters";

beforeEach(() => {
  localStorage.clear();
  mockRouter.setCurrentUrl("/");
});

describe("useFilterSave", () => {
  describe("saveFilter", () => {
    it("shows an info toast and does NOT write to localStorage when there are no query params", async () => {
      mockRouter.setCurrentUrl("/");
      const { result } = renderHook(() => useFilterSave());

      await act(async () => {
        await result.current.saveFilter();
      });

      expect(result.current.toast.open).toBe(true);
      expect(result.current.toast.severity).toBe("info");
      expect(result.current.toast.message).toMatch(/no filters/i);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it("writes the filter to localStorage and shows a success toast", async () => {
      mockRouter.setCurrentUrl("/?section=rent&categories=residential");
      const { result } = renderHook(() => useFilterSave());

      await act(async () => {
        await result.current.saveFilter();
      });

      expect(result.current.toast.open).toBe(true);
      expect(result.current.toast.severity).toBe("success");
      expect(result.current.toast.message).toMatch(/saved successfully/i);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(1);
      expect(stored[0].section).toBe("rent");
      expect(stored[0].categories).toBe("residential");
      expect(stored[0].id).toBeDefined();
    });

    it("shows an info toast and does NOT duplicate when the same filter is saved twice", async () => {
      mockRouter.setCurrentUrl("/?section=sale&minPrice=500");
      const { result } = renderHook(() => useFilterSave());

      await act(async () => {
        await result.current.saveFilter();
      });

      // Reset toast, then save again
      await act(async () => {
        result.current.closeToast();
        await result.current.saveFilter();
      });

      expect(result.current.toast.open).toBe(true);
      expect(result.current.toast.severity).toBe("info");
      expect(result.current.toast.message).toMatch(/already saved/i);

      // Still only one entry in storage
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(1);
    });
  });

  describe("removeSavedFilter", () => {
    it("removes a filter from localStorage and syncs state", async () => {
      mockRouter.setCurrentUrl("/?section=rent");
      const { result } = renderHook(() => useFilterSave());

      await act(async () => {
        await result.current.saveFilter();
      });

      const savedId = result.current.savedFilters[0].id;

      act(() => {
        result.current.removeSavedFilter(savedId);
      });

      expect(result.current.savedFilters).toHaveLength(0);
      expect(result.current.isEmpty).toBe(true);

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toHaveLength(0);
    });
  });

  describe("applySavedFilter", () => {
    it("pushes the saved filter's query params to the router", async () => {
      mockRouter.setCurrentUrl("/?section=rent&categories=condo");
      const { result } = renderHook(() => useFilterSave());

      await act(async () => {
        await result.current.saveFilter();
      });

      const savedId = result.current.savedFilters[0].id;

      // Navigate away, then apply the saved filter
      act(() => {
        mockRouter.setCurrentUrl("/");
      });

      act(() => {
        result.current.applySavedFilter(savedId);
      });

      expect(mockRouter.query.section).toBe("rent");
      expect(mockRouter.query.categories).toBe("condo");
      expect(mockRouter.query.page).toBe(1);
    });

    it("shows an error toast when the filterId does not exist", async () => {
      const { result } = renderHook(() => useFilterSave());

      act(() => {
        result.current.applySavedFilter("nonexistent-id");
      });

      expect(result.current.toast.open).toBe(true);
      expect(result.current.toast.severity).toBe("error");
    });
  });

  describe("localStorage persistence", () => {
    it("loads saved filters from localStorage on mount", async () => {
      const preExisting = [
        { id: "pre123", section: "sale", categories: "residential" },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preExisting));

      const { result } = renderHook(() => useFilterSave());

      await waitFor(() => {
        expect(result.current.savedFilters).toHaveLength(1);
        expect(result.current.savedFilters[0].id).toBe("pre123");
      });
    });

    it("returns an empty array and does not crash when localStorage contains invalid JSON", async () => {
      localStorage.setItem(STORAGE_KEY, "this-is-not-json{{{");

      const { result } = renderHook(() => useFilterSave());

      await waitFor(() => {
        expect(result.current.savedFilters).toEqual([]);
        expect(result.current.isEmpty).toBe(true);
      });
    });
  });

  describe("closeToast", () => {
    it("sets toast.open to false", async () => {
      mockRouter.setCurrentUrl("/?section=rent");
      const { result } = renderHook(() => useFilterSave());

      await act(async () => {
        await result.current.saveFilter();
      });

      expect(result.current.toast.open).toBe(true);

      act(() => {
        result.current.closeToast();
      });

      expect(result.current.toast.open).toBe(false);
    });
  });
});
