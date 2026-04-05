import { renderHook, act } from "@testing-library/react";
import { useSearchForm } from "@/hooks/useSearchForm";
import mockRouter from "next-router-mock";

beforeEach(() => {
  mockRouter.setCurrentUrl("/");
});

describe("useSearchForm — onLocationClick", () => {
  it("pushes { state, page: 1 } when the location type is 'State'", () => {
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.onLocationClick({
        type: "State",
        title: "Selangor",
        slug: "selangor",
      });
    });

    expect(mockRouter.query.state).toBe("Selangor");
    expect(mockRouter.query.page).toBe(1);
    expect(mockRouter.query.city).toBeUndefined();
  });

  it("pushes { city, page: 1 } when the location type is 'City'", () => {
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.onLocationClick({
        type: "City",
        title: "Kuala Lumpur",
        slug: "kuala-lumpur",
      });
    });

    expect(mockRouter.query.city).toBe("Kuala Lumpur");
    expect(mockRouter.query.page).toBe(1);
    expect(mockRouter.query.state).toBeUndefined();
  });

  it("extracts only the city name from 'City, State' format", () => {
    const { result } = renderHook(() => useSearchForm());

    act(() => {
      result.current.onLocationClick({
        type: "City",
        title: "Petaling Jaya, Selangor",
        slug: "petaling-jaya",
      });
    });

    // Only the part before the comma should be used as the city
    expect(mockRouter.query.city).toBe("Petaling Jaya");
  });
});
