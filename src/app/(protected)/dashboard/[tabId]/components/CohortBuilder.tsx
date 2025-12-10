"use server";

import { Box, Divider, Stack } from "@mui/material";
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
    <Box
      flex={1}
      minHeight={0}
      display={"flex"}
      flexDirection={"column"}
      px={2}
      py={1}
    >
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

      <Title
        title="Cohort Builder"
        subTitle="Natural Language"
        marginY={"auto"}
      >
        <CohortQueryInput />
      </Title>

      <Box sx={{ overflow: "hidden" }}>
        <Divider />
      </Box>

      <Title title="Cohort Builder" subTitle="Query Rules" marginY={1} />
      <QueryBuilder query={query?.data} />
    </Box>
  );
};

export default CohortBuilder;
