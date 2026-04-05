import { useRouter } from "next/router";

export function useListingsSort() {
  const router = useRouter();
  const sortFromUrl = router.query.sort as string | undefined;
  
  // Default sort by oldest listings
  const selectedSort = sortFromUrl ?? 'createdAt';

  const handleSortChange = (value: string) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sort: value, page: 1 },
    });
  };

  const clearSort = () => {
    const { sort, ...rest } = router.query;
    router.push({
      pathname: router.pathname,
      query: { ...rest, page: 1 },
    });
  };

  return {
    selectedSort,
    handleSortChange,
    clearSort,
  };
}