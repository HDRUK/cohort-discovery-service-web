"use server";

import { Box, Paper } from "@mui/material";
import QueryBuilder from "@/components/QueryBuilder";
import SubmitQueryButton from "@/components/SubmitQueryButton";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import { Skeleton } from "@mui/material";
import { Suspense } from "react";
import getCollections from "@/actions/getCollections";
import { getAllFields } from "@/actions/omop/getAllCodes";
import QueryResults from "@/components/QueryResults";
import Anchor from "@/components/Anchor";
import { ErrorBoundary } from "react-error-boundary";
import ErrorMessage from "@/components/ErrorMessage";

interface PageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

const NewQueryPageContent = async () => {
  const fields = await getAllFields();
  const collections = await getCollections();

  const activeCollections = collections.data.filter(
    (c) => c.demographics?.find((d) => d.name === "SEX")?.count
  );

  const initialSelection = activeCollections.map((c) => c.pid);

  return (
    <>
      <CohortQueryInput fields={fields} />
      <Box sx={{ maxWidth: 1000 }}>
        <SelectDatasets
          initialSelection={initialSelection}
          collections={activeCollections}
        />
      </Box>
      <Paper
        sx={{
          p: 2,
          my: 2,
        }}
      >
        <QueryBuilder fields={fields} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            width: "100%",
            my: 2,
          }}
        >
          <SubmitQueryButton />
        </Box>
      </Paper>
    </>
  );
};

const NewQueryPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const queryId = params.query;

  return (
    <Box>
      <Suspense fallback={<Skeleton />}>
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
