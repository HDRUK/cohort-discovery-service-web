"use server";

import QueryResultsTable from "@/components/QueryResultsTable";
import getQuery from "@/actions/getQuery";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "@/components/ErrorMessage";

const QueryResults = async ({ queryId }: { queryId: string }) => {
  const query = await getQuery(queryId);
  return (
    <Box>
      <ErrorBoundary
        fallback={
          <ErrorMessage
            title={"Something went wrong with fetching your query"}
          />
        }
      >
        <QueryResultsTable query={query.data} />{" "}
      </ErrorBoundary>
    </Box>
  );
};

export default QueryResults;
