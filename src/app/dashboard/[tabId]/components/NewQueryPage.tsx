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

const NewQueryPageContent = async () => {
  const fields = await getAllFields();
  const collections = await getCollections();
  const initialSelection = collections.data.map((c) => c.pid);

  return (
    <Box>
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
          borderStyle: "solid",
          borderColor: "primary.main",
          borderRadius: 2,
          boxShadow: 3,
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
    </Box>
  );
};

const NewQueryPage = async () => {
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <NewQueryPageContent />
      </Suspense>
    </>
  );
};

export default NewQueryPage;
