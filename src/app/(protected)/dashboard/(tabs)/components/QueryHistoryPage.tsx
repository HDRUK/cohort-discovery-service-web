import { ReactNode, Suspense } from "react";
import { getQueries } from "@/server/data/queries";
import QueriesTable from "@/modules/QueriesTable";
import { SearchParamsTransitionProvider } from "@/contexts/SearchParamsTransitionContext";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
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
    <Title
      title={"History"}
      subTitle={
        total === undefined ? (
          <Skeleton
            variant="text"
            width={40}
            sx={{ display: "inline-block" }}
          />
        ) : (
          `${total}`
        )
      }
    />
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
