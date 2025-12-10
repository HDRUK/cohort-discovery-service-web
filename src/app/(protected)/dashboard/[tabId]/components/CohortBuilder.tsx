"use server";

import { Stack } from "@mui/material";
import QueryBuilder from "@/modules/QueryBuilder";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import getCollections from "@/actions/getCollections";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import FilterDatasets from "@/components/FilterDatasets/FilterDatasets";
import getQuery from "@/actions/getQuery";
import Title from "@/components/Title";

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
        spacing={1}
      >
        <CohortQueryTitle />
        <FilterDatasets />
      </Stack>

      <SelectDatasets
        initialSelection={initialSelection}
        collections={activeCollections}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        borderBottom={1}
        marginBottom={2}
      >
        <Title title="Cohort Builder" subTitle="Natural Language" />
        <CohortQueryInput />
      </Stack>

      <Stack direction="column" spacing={1}>
        <Title title="Cohort Builder" subTitle="Query Rules" />
        <QueryBuilder query={query?.data} />
      </Stack>
    </>
  );
};

export default CohortBuilder;
