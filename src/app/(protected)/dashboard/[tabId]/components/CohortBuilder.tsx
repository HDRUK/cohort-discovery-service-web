"use server";

import { Box, Divider, Stack } from "@mui/material";
import QueryBuilder from "@/modules/QueryBuilder";
import CohortQueryInput from "@/components/CohortQueryInput";
import SelectDatasets from "@/components/SelectDatasets";
import getUserCollections from "@/actions/collection/getUserCollections";
import CohortQueryTitle from "@/components/CohortQueryTitle";
import FilterDatasets from "@/components/FilterDatasets/FilterDatasets";
import getQuery from "@/actions/query/getQuery";
import Title from "@/components/Title";
import { cookies } from "next/headers";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import QueryBuilderGuidanceWrapper from "./QueryBuilderGuidanceWrapper";
import ShowJsonButton from "@/components/ShowJsonButton";
import { buildQueryHistoryParams } from "@/utils/params";
import getQueries from "@/actions/query/getQueries";
import { DEFAULT_QUERIES_DROPDOWN_PER_PAGE } from "@/config/defaults";
import CohortQueryPreview from "@/components/CohortQueryPreview";
import QueryBuilderHeader from "@/modules/QueryBuilderHeader";

const CohortBuilder = async (props: { query?: string }) => {
  const cookieStore = await cookies();
  const query = props.query ? await getQuery(props.query) : null;

  const searchParamsObject = buildQueryHistoryParams({
    page: 1,
    per_page: DEFAULT_QUERIES_DROPDOWN_PER_PAGE,
    sort: "created_at:desc",
  });

  const { data: userQueries } = await getQueries({
    params: searchParamsObject,
  });

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
        <QueryBuilderHeader />

        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={2}
          display={"flex"}
          overflow={"hidden"}
        >
          <Stack direction="column" spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            <CohortQueryInput queries={userQueries.data} />
            <Box sx={{ overflow: "hidden" }}>
              <Divider />
            </Box>
          </Stack>
        </Stack>

        <Title title="Query" subTitle="Preview" marginY={1}>
          <CohortQueryPreview />
        </Title>

        <Title title="Cohort Builder" subTitle="Query Rules" marginY={1}>
          <Box sx={{ ml: "auto" }}>
            <ShowJsonButton />
          </Box>
        </Title>
        <QueryBuilder query={query?.data} />
      </Box>
    </QueryBuilderGuidanceWrapper>
  );
};

export default CohortBuilder;
