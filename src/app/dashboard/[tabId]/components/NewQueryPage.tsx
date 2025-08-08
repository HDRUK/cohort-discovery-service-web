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

interface PageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

const NewQueryPageContent = async () => {
  const fields = await getAllFields();
  const collections = await getCollections();
  const initialSelection = collections.data.map((c) => c.pid);

  return (
    <>
      <CohortQueryInput fields={fields} />
      <Box sx={{ maxWidth: 500 }}>
        <SelectDatasets
          initialSelection={initialSelection}
          collections={collections.data}
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
        <Suspense fallback={<Skeleton height={200} />}>
          <QueryResults queryId={queryId} />
        </Suspense>
      )}
    </Box>
  );
};

export default NewQueryPage;
