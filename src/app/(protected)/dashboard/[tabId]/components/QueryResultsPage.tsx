"use server";

import { Box, Skeleton } from "@mui/material";
import { Suspense } from "react";
import getQuery from "@/actions/getQuery";
import QueryResultsTable from "@/components/QueryResultsTable";

type Params = Promise<{ tabId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

const QueryResultsContent = async ({
  query,
  searchTerm,
}: {
  query: string;
  searchTerm?: string;
}) => {
  const queryData = await getQuery(query as string, searchTerm as string);

  return (
    <Suspense fallback={<Skeleton height={600} />}>
      <Box>
        <QueryResultsTable query={queryData.data} />
      </Box>
    </Suspense>
  );
};

const QueryResultsPage = async (props: PageProps) => {
  const { searchParams } = props;
  const { query, searchTerm } = await searchParams;

  return (
    <Suspense fallback={<Skeleton height={600} />}>
      {query && (
        <QueryResultsContent
          query={query as string}
          searchTerm={searchTerm as string}
        />
      )}
    </Suspense>
  );
};

export default QueryResultsPage;
