import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  GetServerSidePropsContext,
} from "next";
import { getListingsData } from "@/utils/functions";
import { ListingsResponse } from "@/utils/types";
import ListingsGrid from "@/components/ListingsGrid";

export const getServerSideProps: GetServerSideProps<{
  data: ListingsResponse;
}> = async (ctx: GetServerSidePropsContext) => {
  const data = await getListingsData(ctx);

  return { props: { data } };
};

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return <ListingsGrid data={data} />;
}
