import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  filterSchema,
  type FilterFormValues,
} from "@/schemas/filterSchema";
import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { getFilterDefaultsFromQuery } from "@/utils/functions";

export function useFilterForm() {
  const [filterOpen, setFilterOpen] = useState(false);
  const router = useRouter();

  const {
    minPrice: minPriceQuery,
    maxPrice: maxPriceQuery,
    categories: categoriesQuery,
    types: typesQuery,
    bedRooms: bedRoomsQuery,
    bathRooms: bathRoomsQuery,
    furnishings: furnishingsQuery,
    ...restQuery
  } = router.query

  const activeFilterCount = ((): number => {
    let count = 0
    if (minPriceQuery) count++;
    if (maxPriceQuery) count++;
    if (categoriesQuery) count++;
    if (typesQuery?.length) count ++;
    if (bedRoomsQuery?.length) count ++;
    if (bathRoomsQuery?.length) count ++;
    if (furnishingsQuery?.length) count ++;
    return count;
  })();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: getFilterDefaultsFromQuery(router.query),
  });

  const categories = useWatch({
    control: control,
    name: "categories",
  });

  const propertyTypes = useWatch({
    control: control,
    name: "types",
  });

  const showPropertyTypes = categories === "residential";

  const bedRooms = useWatch({
    control: control,
    name: "bedRooms",
  });

  const bathRooms = useWatch({
    control: control,
    name: "bathRooms",
  });

  const furnishings = useWatch({
    control: control,
    name: "furnishings",
  });

  const togglePropertyType = (type: string) => {
    const current = getValues("types");
    if (!current) return;

    if (current.includes(type)) {
      setValue("types", current.filter((t) => t !== type));
    } else {
      setValue("types", [...current, type]);
    }
  }

  const toggleBedrooms = (bedrooms: number) => {
    const current = getValues("bedRooms");
    if (!current) return;

    if (current.includes(bedrooms)) {
      setValue("bedRooms", current.filter((b) => b !== bedrooms));
    } else {
      setValue("bedRooms", [...current, bedrooms]);
    }
  }

  const toggleBathrooms = (bathrooms: number) => {
    const current = getValues("bathRooms");
    if (!current) return;

    if (current.includes(bathrooms)) {
      setValue("bathRooms", current.filter((b) => b !== bathrooms));
    } else {
      setValue("bathRooms", [...current, bathrooms]);
    }
  }

  const toggleFurnishings = (furnishing: string) => {
    const current = getValues("furnishings");
    if (!current) return;

    if (current.includes(furnishing)) {
      setValue("furnishings", current.filter((f) => f !== furnishing));
    } else {
      setValue("furnishings", [...current, furnishing]);
    }
  }

  const applyFilters = handleSubmit((data) => {
    // Manually construct the query object to avoid empty queries params in the url
    const queryObj: {[key: string]: string | string[] | number |number[]} = {};

    if (data.minPrice) queryObj['minPrice'] = data.minPrice;
    if (data.maxPrice) queryObj['maxPrice'] = data.maxPrice;

    if (data.categories) queryObj['categories'] = data.categories;

    if (data.types?.length) queryObj['types'] = data.types;

    if (data.bedRooms?.length) queryObj['bedRooms'] = data.bedRooms;

    if (data.bathRooms?.length) queryObj['bathRooms'] = data.bathRooms;

    if (data.furnishings?.length) queryObj['furnishings'] = data.furnishings;

    router.push({
      pathname: router.pathname,
      query: {
        ...restQuery,
        ...queryObj,
      }
    })
  });

  const clearFilters = () => {
    router.push({
      pathname: router.pathname,
      query: {
        ...restQuery,
        page: 1,
      }
    })
  }

  const handleCloseFilter = () => {
    setFilterOpen(false)
    reset()
  }

  return {
    register,
    applyFilters,
    clearFilters,
    setValue,
    errors,
    categories,
    showPropertyTypes,
    propertyTypes,
    togglePropertyType,
    bedRooms,
    toggleBedrooms,
    bathRooms,
    toggleBathrooms,
    furnishings,
    toggleFurnishings,
    filterOpen,
    setFilterOpen,
    handleCloseFilter,
    activeFilterCount,
  };
}