"use server";

import getQuery from "@/actions/query/getQuery";
import getQueries from "@/actions/query/getQueries";
import { cookies } from "next/headers";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import { buildQueryHistoryParams } from "@/utils/params";
import { DEFAULT_QUERIES_DROPDOWN_PER_PAGE } from "@/config/defaults";
import CohortBuilderClient from "./CohortBuilderClient";

const CohortBuilder = async (props: { query?: string }) => {
  const cookieStore = await cookies();
  const cookie = cookieStore?.get(QUERY_BUILDER_GUIDANCE_COOKIE);

  const query = props.query ? await getQuery(props.query) : null;

  const searchParamsObject = buildQueryHistoryParams({
    page: 1,
    per_page: DEFAULT_QUERIES_DROPDOWN_PER_PAGE,
    sort: "created_at:desc",
  });

  const { data: userQueries } = await getQueries({
    params: searchParamsObject,
  });

  return (
    <CohortBuilderClient
      initialShowGuidance={!cookie?.value}
      userQueries={userQueries.data}
      query={query?.data}
    />
  );
};

export default CohortBuilder;
