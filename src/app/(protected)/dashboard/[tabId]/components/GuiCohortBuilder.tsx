"use server";

import { Box, Grid } from "@mui/material";
import QueryBuilder from "@/modules/QueryBuilder";
import SubmitQueryButton from "@/components/SubmitQueryButton";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import getCollections from "@/actions/getCollections";

const GuiCohortBuilder = async () => {
  const collections = await getCollections();

  const activeCollections = collections.data.filter(
    (c) => c.demographics?.find((d) => d.name === "SEX")?.count
  );

  const initialSelection = activeCollections.map((c) => c.pid);

  return (
    <Box>
      {/*<CohortQueryTitle />*/}
      <CohortQueryInput />
      <Box sx={{ maxWidth: 1000 }}>
        <SelectDatasets
          initialSelection={initialSelection}
          collections={activeCollections}
        />
      </Box>

      <QueryBuilder />

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
    </Box>
  );
};

export default GuiCohortBuilder;
