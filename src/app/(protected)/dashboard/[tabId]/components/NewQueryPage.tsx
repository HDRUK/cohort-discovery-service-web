"use server";

import { Box } from "@mui/material";
import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import QueryResults from "@/components/QueryResults";
import Anchor from "@/components/Anchor";
import GuiCohortBuilder from "./GuiCohortBuilder";

interface PageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

const NewQueryPageContent = async () => {
  return (
    <Suspense fallback={<Skeleton height={400} />}>
      <GuiCohortBuilder />
    </Suspense>
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
            <QueryResults key={queryId} queryId={queryId} />
          </Suspense>
        </>
      )}
    </Box>
  );
};

export default NewQueryPage;
