"use server";

import { Alert, Divider, Skeleton } from "@mui/material";
import { Suspense } from "react";
import QueryResultsTable from "@/components/QueryResultsTable";
import getQuery from "@/actions/getQuery";
import Title from "@/components/Title";
import { queryToText } from "@/utils/queryBuilder";
import { buildQueryHistoryParams } from "@/utils/params";
import { QueryHistorySearchParams } from "@/types/api";
import { getQueryName } from "@/utils/query";

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
              id: queryData.data.pid,
              entity: "queries",
              format: "json",
            },
            refreshProps: { tag: queryData.data.pid, disabled: true },
            deleteProps: { disabled: true },
            sortProps: { field: "collection.name" },
          },
        }}
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
