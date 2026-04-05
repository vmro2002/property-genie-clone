import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, type SearchFormValues } from "@/schemas/searchSchema";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
import type { SearchLocation } from "@/utils/types";

export function useSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryKeyword = searchParams.get("q");

  const {state, city, ...rest} = router.query;

  const {
    control,
    handleSubmit,
    register,
    setValue,
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      q: queryKeyword ?? "",
    },
  });

  const keyword = useWatch({
    control: control,
    name: "q",
  });

  const onSubmit = handleSubmit((data) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, q: data.q, page: 1 },
    });
  });

  const onLocationClick = (location: SearchLocation) => {
    if (location.type === "State") {
      router.push({
        pathname: router.pathname,
        query: {
          ...rest, 
          state: location.title
        }
      })
    }
    if (location.type === "City") {
      router.push({
        pathname: router.pathname,
        query: {
          ...rest, 
          city: location.title.split(',')[0]
        }
      })
    }
  }


  return { 
    register,
    setValue,
    onSubmit,
    keyword,
    onLocationClick,
  };
}
