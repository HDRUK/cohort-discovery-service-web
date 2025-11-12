"use server";

import { Box, Stack } from "@mui/material";
import QueryBuilder from "@/modules/QueryBuilder";
import SubmitQueryButton from "@/components/SubmitQueryButton";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import getCollections from "@/actions/getCollections";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import FilterDatasets from "@/components/FilterDatasets/FilterDatasets";

const CohortBuilder = async () => {
  const collections = await getCollections();

  const activeCollections = collections.data.filter(
    (c) => c.demographics?.find((d) => d.name === "SEX")?.count
  );

  const initialSelection = activeCollections.map((c) => c.pid);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <CohortQueryTitle />
        <FilterDatasets />
      </Stack>
      <SelectDatasets
        initialSelection={initialSelection}
        collections={activeCollections}
      />
      <CohortQueryInput />

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
    </>
  );
};

export default CohortBuilder;
