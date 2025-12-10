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
import { cookies } from "next/headers";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import QueryBuilderGuidanceWrapper from "./QueryBuilderGuidanceWrapper";

const CohortBuilder = async (props: { query?: string }) => {
  const collections = await getCollections();
  const cookieStore = await cookies();
  const query = props.query ? await getQuery(props.query) : null;

  const activeCollections = collections.data.filter(
    (c) => c.demographics?.find((d) => d.name === "SEX")?.count
  );

  const initialSelection = activeCollections.map((c) => c.pid);

  const cookie = cookieStore?.get(QUERY_BUILDER_GUIDANCE_COOKIE);

  return (
    <QueryBuilderGuidanceWrapper cookie={cookie}>
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
    </QueryBuilderGuidanceWrapper>
  );
};

export default CohortBuilder;
