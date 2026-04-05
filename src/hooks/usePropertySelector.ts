import { useRouter } from "next/router";

export function usePropertySelector() {
  const router = useRouter();
  const section = router.query.section as string | undefined ?? "sale";


  const setSection  = (value: 'rent' | 'sale') => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query, 
        section: value,
        page: 1
      }
    })
  }

  return { section, setSection };
}
