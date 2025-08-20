"use server";

import QueryResultsTable from "@/components/QueryResultsTable";
import getQuery from "@/actions/getQuery";
import { Box } from "@mui/material";

const QueryResults = async ({ queryId }: { queryId: string }) => {
  const query = await getQuery(queryId);
  return <Box>{query && <QueryResultsTable query={query.data} />}</Box>;
};

export default QueryResults;
