"use server";

import { Stack } from "@mui/material";
import QueryBuilder from "@/modules/QueryBuilder";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import getCollections from "@/actions/getCollections";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import FilterDatasets from "@/components/FilterDatasets/FilterDatasets";
import getQuery from "@/actions/getQuery";

const CohortBuilder = async (props: { query?: string }) => {
  const collections = await getCollections();
  const query = props.query ? await getQuery(props.query) : null;

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

      <QueryBuilder query={query?.data} />
    </>
  );
};

export default CohortBuilder;
