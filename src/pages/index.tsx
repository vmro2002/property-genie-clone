import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { getListingsData } from "@/utils/functions";
import { ListingsResponse } from "@/utils/types";
import ListingsGrid from "@/components/ListingsGrid";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import SearchBar from "@/components/SearchBar";
import {useSearchParams} from "next/navigation";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<{
  data: ListingsResponse;
}> = async (ctx: GetServerSidePropsContext) => {
  const data = await getListingsData(ctx);

  return { props: { data } };
};

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const searchParams = useSearchParams();
  const keyword = searchParams.get("q");

  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}
    >
      {keyword && (
        <Breadcrumbs
        separator=">"
        sx={{
          color: 'primary.main'
        }}
        >
          <Link 
          href="/"
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
            Search Results for "{keyword}"
          </Typography>

        </Breadcrumbs>
      )}
      <Box
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 3,
        p: 2
      }}
      >
        <SearchBar/>
      </Box>
      <ListingsGrid data={data} />
    </Box>
  )
}
