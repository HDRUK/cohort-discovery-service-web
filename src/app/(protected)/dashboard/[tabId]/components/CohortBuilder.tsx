"use server";

import { Box, Divider, Stack } from "@mui/material";
import QueryBuilder from "@/modules/QueryBuilder";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import getUserCollections from "@/actions/getUserCollections";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import FilterDatasets from "@/components/FilterDatasets/FilterDatasets";
import getQuery from "@/actions/getQuery";
import Title from "@/components/Title";
import { cookies } from "next/headers";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import QueryBuilderGuidanceWrapper from "./QueryBuilderGuidanceWrapper";
import ShowJsonButton from "@/components/ShowJsonButton";
import CohortErrors from "@/components/CohortErrors";

const NODE_ENV = process.env?.NODE_ENV;

const CohortBuilder = async (props: { query?: string }) => {
  const collections = await getUserCollections();

  const cookieStore = await cookies();
  const query = props.query ? await getQuery(props.query) : null;

  const initialSelection = collections.data.map((c) => c.pid);

  const cookie = cookieStore?.get(QUERY_BUILDER_GUIDANCE_COOKIE);

  return (
    <QueryBuilderGuidanceWrapper initialShowGuidance={!cookie?.value}>
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
          collections={collections.data}
        />

        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={2}
          display={"flex"}
          overflow={"hidden"}
        >
          <Title
            marginTop={1.5}
            title="Cohort Builder"
            subTitle="Natural Language"
          />

          <Stack direction="column" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <CohortQueryInput />
            <CohortErrors />
          </Stack>
        </Stack>

        <Box sx={{ overflow: "hidden" }}>
          <Divider />
        </Box>

        <Title title="Cohort Builder" subTitle="Query Rules" marginY={1}>
          {NODE_ENV === "development" && (
            <Box sx={{ ml: "auto" }}>
              <ShowJsonButton />
            </Box>
          )}
        </Title>
        <QueryBuilder query={query?.data} />
      </Box>
    </QueryBuilderGuidanceWrapper>
  );
};

export default CohortBuilder;
