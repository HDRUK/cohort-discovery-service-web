"use server";

import { Alert, Divider, Skeleton } from "@mui/material";
import { Suspense } from "react";
import QueryResultsTable from "@/modules/QueryResultsTable";
import getQuery from "@/actions/query/getQuery";
import Title from "@/components/Title";
import { queryToText } from "@/utils/queryBuilder";
import { buildQueryHistoryParams } from "@/utils/params";
import { QueryHistorySearchParams } from "@/types/api";
import { getQueryName } from "@/utils/query";
import { AvailableFormats } from "@/components/DownloadButton/DownloadButton";

type PageSearchParams = Promise<QueryHistorySearchParams>;

interface PageProps {
  searchParams: PageSearchParams;
}

const QueryResultsPageContent = async ({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) => {
  const { query, ...rest } = await searchParams;

  const searchParamsObject = buildQueryHistoryParams(rest);

  const queryData = await getQuery(query as string, {
    params: searchParamsObject,
  });

  return (
    <>
      <Title title={"Query Results"} subTitle={getQueryName(queryData.data)} />
      {queryToText(queryData.data.definition)}
      <Divider />
      <QueryResultsTable
        initialData={queryData.data}
        initialSearchParams={searchParamsObject}
        useTableProps={{ enableRowSelection: true }}
        tableProps={{
          leftAction: {
            searchProps: {
              placeholder: "Search your query results...",
            },
          },
          rightAction: {
            downloadProps: {
              ids: [queryData.data.pid],
              entity: "queries",
              formats: [AvailableFormats.JSON],
            },
            // sortProps: { field: "collection.name" },
            // **SC - disabling this for now because it uses query string for sorting order. But this is not scoped
            // to the tab, but to the whole page, meaning it's being incorrectly applied to the history page too,
            // which results in an error. This needs rearchitecting to not use the query string, but that's a
            // bigger job than the value right now
          },
        }}
        showGuidance
      />
    </>
  );
};

const QueryResultsPage = async (props: PageProps) => {
  const { searchParams } = props;
  const { query } = await searchParams;

  return (
    <Suspense fallback={<Skeleton height={600} />}>
      {query ? (
        <QueryResultsPageContent searchParams={searchParams} />
      ) : (
        <Alert severity="error">No query found</Alert>
      )}
    </Suspense>
  );
};

export default QueryResultsPage;
