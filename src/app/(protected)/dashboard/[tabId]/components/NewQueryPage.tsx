"use server";

import { Box } from "@mui/material";
import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import QueryResults from "@/components/QueryResults";
import Anchor from "@/components/Anchor";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "@/components/ErrorMessage";
import TabsShell from "@/components/TabsShell";
import GuiCohortBuilder from "./GuiCohortBuilder";
import SqlCohortBuilder from "./SqlCohortBuilder";
import JsonCohortBuilder from "./JsonCohortBuilder";

interface PageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

const NewQueryPageContent = async () => {
  return (
    <TabsShell labels={["GUI Builder", "SQL Builder", "JSON Builder"]}>
      <Suspense fallback={<Skeleton height={400} />}>
        <GuiCohortBuilder />
      </Suspense>
      <Suspense fallback={<Skeleton height={400} />}>
        <SqlCohortBuilder />
      </Suspense>
      <Suspense fallback={<Skeleton height={400} />}>
        <JsonCohortBuilder />
      </Suspense>
    </TabsShell>
  );
};

const NewQueryPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const queryId = params.query;

  return (
    <Box>
      <Suspense fallback={<Skeleton height={600} />}>
        <NewQueryPageContent />
      </Suspense>
      {queryId && (
        <>
          <Anchor name={"query"} />
          <Suspense key={queryId} fallback={<Skeleton height={200} />}>
            <ErrorBoundary
              fallback={<ErrorMessage title={"Cannot find query " + queryId} />}
            >
              <QueryResults key={queryId} queryId={queryId} />
            </ErrorBoundary>
          </Suspense>
        </>
      )}
    </Box>
  );
};

export default NewQueryPage;
