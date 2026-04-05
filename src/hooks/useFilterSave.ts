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
    if (Object.keys(rest).length === 0) {
      showToast('No filters to save.', 'info')
      return
    }
    const filterString = stableStringify(rest)

    const encoder = new TextEncoder()
    const encodedString = encoder.encode(filterString)

    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedString)
    
    const filterId = Array.from(new Uint8Array(hashBuffer))
      .map((buffer) => buffer.toString(16).padStart(2, "0"))
      .join("")

    const filterExists = savedFilters.some((filter) => filter.id === filterId)

    if (filterExists) {
      showToast("Result already saved before.", 'info')
      return
    }

    const newFilters = [...savedFilters, {id: filterId, ...rest}]
   
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters))
    setSavedFilters(newFilters)

    showToast('Search saved successfully.', "success")
  }

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
