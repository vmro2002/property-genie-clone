import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { FilterSaveToast } from "@/utils/types";
import { stableStringify } from "@/utils/functions";
import type { ListingFilter } from "@/utils/types";

const STORAGE_KEY = "property-genie-saved-filters";

export function useFilterSave() {
  const router = useRouter();
  const [savedModalOpen, setSavedModalOpen] = useState(false);

  const [toast, setToast] = useState<FilterSaveToast>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message: string, severity: FilterSaveToast["severity"]) => {
      setToast({ open: true, message, severity });
  }

  const closeToast = () => {
    setToast((t) => ({ ...t, open: false }));
  }

  /**
   * Load saved filters from local storage
   */
  const getSavedFilters = (): ListingFilter[] => {
    if (typeof window === "undefined") return [];

    try {
      const filters = window.localStorage.getItem(STORAGE_KEY);
      return filters ? JSON.parse(filters) as ListingFilter[] : []
    } catch {
      return []
    }
  }

  const [savedFilters, setSavedFilters] = useState<ListingFilter[]>([])

  const {page, ...rest} = router.query

  const saveFilter = async () => {
    // prevent saving empty filters
    if (Object.keys(rest).length === 0) {
      showToast('No filters to save.', 'info')
      return
    }

    // convert the filter object to a string
    const filterString = stableStringify(rest)

    // encode the string to a buffer
    const encoder = new TextEncoder()
    const encodedString = encoder.encode(filterString)

    // hash the encoded string
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedString)
    
    // convert the hash buffer to a hex string 
    // this is a unique identifier for the filter
    const filterId = Array.from(new Uint8Array(hashBuffer))
      .map((buffer) => buffer.toString(16).padStart(2, "0"))
      .join("")

    // prevent saving duplicate filters
    const filterExists = savedFilters.some((filter) => filter.id === filterId)

    if (filterExists) {
      showToast("Result already saved before.", 'info')
      return
    }

    const newFilters = [...savedFilters, {id: filterId, ...rest}]
   
    // save the new filters to local storage
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters))
    // sync the state
    setSavedFilters(newFilters)

    showToast('Search saved successfully.', "success")
  }

  // remove filter from local storage and sync state
  const removeSavedFilter = (filterId: string) => {
      const newFilters = savedFilters.filter((filter) => filter.id !== filterId)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters))
      setSavedFilters(newFilters)
  }

  const applySavedFilter = (filterId: string) => {
    const filter = savedFilters.find((filter) => filter.id === filterId)

    if (!filter) {
      showToast('An error occured whilst saving.', 'error')
      return
    }

    const {id, ...query} = filter

    router.push({
      pathname: router.pathname,
      query: {
        ...query,
        page: 1,
      }
    })
  }

  // load saved filters from local storage on mount
  useEffect(() => {
    setSavedFilters(getSavedFilters())
  }, [])

  const isEmpty = savedFilters.length == 0;

  return {
    savedFilters,
    isEmpty,
    savedModalOpen,
    toast,
    closeToast,
    saveFilter,
    setSavedModalOpen,
    removeSavedFilter,
    applySavedFilter
  };
}
