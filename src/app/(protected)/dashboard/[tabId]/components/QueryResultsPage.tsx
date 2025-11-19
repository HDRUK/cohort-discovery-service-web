"use server";

import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import QueryResults from "@/modules/QueryResults";

type Params = Promise<{ tabId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

const QueryResultsPage = async (props: PageProps) => {
  const { searchParams } = props;
  const { query, searchTerm } = await searchParams;

  return (
    <Suspense fallback={<Skeleton height={600} />}>
      {query && (
        <QueryResults
          query={query as string}
          searchTerm={searchTerm as string}
        />
      )}
    </Suspense>
  );
};

export default QueryResultsPage;
