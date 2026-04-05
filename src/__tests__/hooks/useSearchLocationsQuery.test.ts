import { renderHook, act, waitFor } from "@testing-library/react";
import { useSearchLocationsQuery } from "@/hooks/useSearchLocationsQuery";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        // Disable garbage collection delay so the cache doesn't interfere
        gcTime: 0,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

describe("useSearchLocationsQuery", () => {
  it("does not fetch when the initial input is empty (enabled=false)", () => {
    const wrapper = makeWrapper();
    renderHook(() => useSearchLocationsQuery(""), { wrapper });

    // Empty string → debouncedValue = "" → enabled=false → fetch never called
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches from /api/locations with the correct encoded keyword for a non-empty input", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify([
        { type: "City", title: "Kuala Lumpur", slug: "kuala-lumpur" },
      ]),
    );

    const wrapper = makeWrapper();
    // Non-empty initial value → debouncedValue = "kuala" at mount → enabled=true → fetch fires
    const { result } = renderHook(() => useSearchLocationsQuery("kuala"), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.locationsIsFetching).toBe(false);
    });

    const calledUrl = fetchMock.mock.calls[0][0] as string;
    expect(calledUrl).toContain("/api/locations");
    expect(calledUrl).toContain("keyword=kuala");
    expect(result.current.locations).toHaveLength(1);
    expect(result.current.locations![0].title).toBe("Kuala Lumpur");
  });

  it("does not fetch when the value changes from empty until the debounce fires", async () => {
    fetchMock.mockResponse(JSON.stringify([]));
    jest.useFakeTimers();

    const wrapper = makeWrapper();
    const { rerender } = renderHook(
      ({ val }: { val: string }) => useSearchLocationsQuery(val),
      { wrapper, initialProps: { val: "" } },
    );

    // Change value — debounce timer starts but hasn't fired yet
    rerender({ val: "kl" });

    // Advance only 100ms (< 300ms debounce)
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(fetchMock).not.toHaveBeenCalled();

    jest.useRealTimers();
  });

  it("surfaces an error when the API returns a non-ok response", async () => {
    fetchMock.mockResponseOnce("Not Found", { status: 404 });

    const wrapper = makeWrapper();
    const { result } = renderHook(() => useSearchLocationsQuery("missing"), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.locationsError).not.toBeNull();
    });

    expect(result.current.locationsError?.message).toMatch(/404/);
    expect(result.current.locations).toBeUndefined();
  });
});
