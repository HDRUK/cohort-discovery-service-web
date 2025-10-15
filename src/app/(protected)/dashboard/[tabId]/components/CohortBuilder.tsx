"use server";

import { Box } from "@mui/material";
import QueryBuilder from "@/modules/QueryBuilder";
import SubmitQueryButton from "@/components/SubmitQueryButton";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import getCollections from "@/actions/getCollections";

const CohortBuilder = async () => {
  const collections = await getCollections();

  const activeCollections = collections.data.filter(
    (c) => c.demographics?.find((d) => d.name === "SEX")?.count
  );

  const initialSelection = activeCollections.map((c) => c.pid);

  return (
    <>
      {/*<CohortQueryTitle /> note: to be reimplemented*/}
      {/*<CohortQueryInput />*/}
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
    </>
  );
};

export default CohortBuilder;
