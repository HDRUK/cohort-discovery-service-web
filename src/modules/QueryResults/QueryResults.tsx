"use server";

import getQuery from "@/actions/getQuery";
import { Box } from "@mui/material";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "@/components/ErrorMessage";
import QueryResultsTable from "@/components/QueryResultsTable";

const QueryResults = async ({
  query,
  searchTerm,
}: {
  query: string;
  searchTerm?: string;
}) => {
  const queryData = await getQuery(query as string, searchTerm as string);

  return (
    <Box>
      <ErrorBoundary
        fallback={
          <ErrorMessage
            title={"Something went wrong with fetching your query"}
          />
        }
      >
        <QueryResultsTable query={queryData.data} />
      </ErrorBoundary>
    </Box>
  );
};

export default QueryResults;
