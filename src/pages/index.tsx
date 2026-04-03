import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { getListingsData } from "@/utils/functions";
import { ListingsResponse } from "@/utils/types";
import ListingsGrid from "@/components/ListingsGrid";
import { Box } from "@mui/material";
import SearchBar from "@/components/SearchBar";

export const getServerSideProps: GetServerSideProps<{
  data: ListingsResponse;
}> = async (ctx: GetServerSidePropsContext) => {
  const data = await getListingsData(ctx);

  return { props: { data } };
};

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}
    >
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
