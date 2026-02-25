"use server";

import { Suspense } from "react";
import getQueries from "@/actions/query/getQueries";
import QueriesTable from "@/modules/QueriesTable";
import { QueriesTableSkeleton } from "@/modules/QueriesTable";
import { Box } from "@mui/material";
import Title from "@/components/Title";
import { ApiSearchParams } from "@/types/api";
import { buildQueryHistoryParams } from "@/utils/params";

interface PageProps {
  searchParams: Promise<ApiSearchParams>;
}

const QueryHistoryPageContent = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const searchParamsObject = buildQueryHistoryParams(params);

  const queries = await getQueries({ params: searchParamsObject });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        height: "100%",
        gap: 1,
      }}
    >
      <Title title={"History"} subTitle={`${queries.data.total}`} />
      <QueriesTable initialData={queries.data} />
    </Box>
  );
};

const QueryHistoryPage = async ({ searchParams }: PageProps) => {
  return (
    <>
      <Suspense fallback={<QueriesTableSkeleton />}>
        <QueryHistoryPageContent searchParams={searchParams} />
      </Suspense>
    </>
  );
};

export default QueryHistoryPage;
