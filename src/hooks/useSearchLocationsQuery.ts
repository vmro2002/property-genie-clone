import { useQuery } from "@tanstack/react-query";
import type { SearchLocation } from "@/utils/types";
import { useDebounce } from "use-debounce";

export const useSearchLocationsQuery = (value: string) =>  {

  const [debouncedValue] = useDebounce(value, 300);

  const {
    data: locations, 
    isFetching: locationsIsFetching,
    error: locationsError,
  } = useQuery<SearchLocation[]>({
    queryKey: ["searchLocations", debouncedValue],
    queryFn: async () => {

      const res = await fetch(
        `/api/locations?keyword=${encodeURIComponent(debouncedValue)}`
      );

      if (!res.ok) throw new Error(`Search failed: ${res.status}`);

      return res.json();
    },
    placeholderData: (prev) => prev,
    enabled: debouncedValue.length > 0, // Only fetch if there is a value
  });

  return {
    locations,
    locationsIsFetching,
    locationsError,
  }
}