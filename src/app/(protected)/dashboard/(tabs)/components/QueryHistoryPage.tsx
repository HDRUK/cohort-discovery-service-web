import { Suspense } from "react";
import { getQueries } from "@/server/data/queries";
import QueriesTable from "@/modules/QueriesTable";
import { QueriesTableSkeleton } from "@/modules/QueriesTable";
import { Box } from "@mui/material";
import Title from "@/components/Title";
import { ApiSearchParams } from "@/types/api";
import { buildQueryHistoryParams } from "@/utils/params";

interface PageProps {
  searchParams: Promise<ApiSearchParams>;
}

const loadQueries = async (params: ApiSearchParams) => {
  const queries = await getQueries({
    params: buildQueryHistoryParams(params),
  });

  return { queries, fetchedAt: Date.now() };
};

const QueryHistoryPageContent = async ({ searchParams }: PageProps) => {
  const { queries, fetchedAt } = await loadQueries(await searchParams);

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
      <QueriesTable initialData={queries.data} fetchedAt={fetchedAt} />
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
