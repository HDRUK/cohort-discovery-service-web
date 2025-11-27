"use server";

import { Suspense } from "react";
import getQueries from "@/actions/getQueries";
import QueriesTable from "@/components/QueriesTable";
import { QueriesTableSkeleton } from "@/components/QueriesTable";
import { Box } from "@mui/material";
import Title from "@/components/Title";
import { ApiSearchParams } from "@/types/api";
import { buildSearchParams } from "@/utils/params";

interface PageProps {
  searchParams: Promise<ApiSearchParams>;
}

const QueryHistoryPageContent = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const { page, per_page, searchTerm, sort } = params ?? {};

  const queryParams = {
    page,
    per_page,
    ["name[]"]: searchTerm,
    sort,
  };

  const searchParamsObject = buildSearchParams(queryParams);

  const queries = await getQueries(searchParamsObject);

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
      <QueriesTable
        queries={queries.data}
        hasIncomplete={queries.hasIncomplete}
      />
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
