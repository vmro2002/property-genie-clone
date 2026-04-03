import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchSchema, type SearchFormValues } from "@/schemas/searchSchema";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

export function useSearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryKeyword = searchParams.get("q");

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


  return { 
    register,
    setValue,
    onSubmit,
    keyword,
  };
}
