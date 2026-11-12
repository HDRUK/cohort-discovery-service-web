import { ReactNode, Suspense } from "react";
import { getQueries } from "@/server/data/queries";
import QueriesTable, { QueryHistoryTitle } from "@/modules/QueriesTable";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { Box } from "@mui/material";
import { ApiSearchParams } from "@/types/api";
import { buildQueryHistoryParams } from "@/utils/params";

interface PageProps {
  searchParams: Promise<ApiSearchParams>;
}

const QueryHistoryLayout = ({
  total,
  children,
}: {
  total?: number;
  children: ReactNode;
}) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      flex: 1,
      height: "100%",
      gap: 1,
    }}
  >
    <QueryHistoryTitle total={total} />
    {children}
  </Box>
);

const QueryHistoryPageContent = async ({ searchParams }: PageProps) => {
  const queries = await getQueries({
    params: buildQueryHistoryParams(await searchParams),
  });

  return (
    <QueryHistoryLayout total={queries.data.total}>
      <QueriesTable initialData={queries.data} />
    </QueryHistoryLayout>
  );
};

const QueryHistoryPage = async ({ searchParams }: PageProps) => {
  return (
    <SearchParamsTransitionProvider>
      <Suspense
        fallback={
          <QueryHistoryLayout>
            <QueriesTable />
          </QueryHistoryLayout>
        }
      >
        <QueryHistoryPageContent searchParams={searchParams} />
      </Suspense>
    </SearchParamsTransitionProvider>
  );
};

export default QueryHistoryPage;
