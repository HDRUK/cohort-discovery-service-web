"use server";

import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import QueryResultsTable from "@/components/QueryResultsTable";
import getQuery from "@/actions/getQuery";

type Params = Promise<{ tabId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

const QueryResultsPageContent = async ({
  query,
  searchTerm,
  sort,
}: {
  query: string;
  searchTerm?: string;
  sort?: string;
}) => {
  const searchParams = new URLSearchParams();
  if (searchTerm) {
    searchParams.append("name[]", searchTerm as string);
  }
  if (sort) {
    searchParams.append("sort", sort as string);
  }
  const queryData = await getQuery(query as string, searchParams);

  return <QueryResultsTable query={queryData.data} />;
};

const QueryResultsPage = async (props: PageProps) => {
  const { searchParams } = props;
  const { query, searchTerm, sort } = await searchParams;

  return (
    <Suspense fallback={<Skeleton height={600} />}>
      {query && (
        <QueryResultsPageContent
          query={query as string}
          searchTerm={searchTerm as string}
          sort={sort as string}
        />
      )}
    </Suspense>
  );
};

export default QueryResultsPage;
