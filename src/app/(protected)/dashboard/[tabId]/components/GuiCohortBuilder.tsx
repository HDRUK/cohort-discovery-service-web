"use server";

import { Box, Paper } from "@mui/material";
import QueryBuilder from "@/components/QueryBuilder";
import SubmitQueryButton from "@/components/SubmitQueryButton";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import getCollections from "@/actions/getCollections";
import { getAllFields } from "@/actions/omop/getAllCodes";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import getConceptSets from "@/actions/getConceptSets";

const GuiCohortBuilder = async () => {
  const fields = await getAllFields();
  const collections = await getCollections();

  const activeCollections = collections.data.filter(
    (c) => c.demographics?.find((d) => d.name === "SEX")?.count
  );

  const initialSelection = activeCollections.map((c) => c.pid);

  return (
    <>
      <CohortQueryTitle />
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

export default GuiCohortBuilder;
