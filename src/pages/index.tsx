import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { getListingsData } from "@/utils/functions";
import { ListingsResponse } from "@/utils/types";
import ListingsGrid from "@/components/ListingsGrid";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import SearchBar from "@/components/SearchBar/SearchBar";
import Link from "next/link";
import { useRouter } from "next/router";
import FilterModal from "@/components/FilterModal/FilterModal";
import PropertySectionSelector from "@/components/PropertySectionSelector";

export const getServerSideProps: GetServerSideProps<{
  data: ListingsResponse;
}> = async (ctx: GetServerSidePropsContext) => {
  const data = await getListingsData(ctx);

  return { props: { data } };
};

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const router = useRouter();
  const {q, state, city, ...rest} = router.query;

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}
    >
      {q || city || state && (
        <Breadcrumbs
        separator=">"
        sx={{
          color: 'primary.main'
        }}
        >
          <Link 
          href={{
            pathname: "/",
            query: {
              ...rest,
            },
          }}
          style={{
            textDecoration: 'none',
            color: 'inherit',
          }}
          >
            Home
          </Link>
          <Typography 
          variant="body2" 
          color="text.secondary"
          >
            {q && `Search Results for "${q}"`}
            {city && city}
            {state && state}
          </Typography>

        </Breadcrumbs>
      )}
      <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        p: 2,
        display: 'flex',
        flexDirection: {
          xs: 'column',
          md: 'row',
        },
        gap: {
          xs: 2,
          md: 1
        }
      }}
      >
        <SearchBar/>
        <Box
        sx={{
          display: 'flex',
          flexWrap: {
            xs: 'wrap',
            sm: 'nowrap'
          },
          gap: 1,
        }}
        >

        <FilterModal />
        <PropertySectionSelector />
        </Box>
      </Box>
      <ListingsGrid data={data} />
    </Box>
  )
}
