import { getQueries, getQuery } from "@/server/data/queries";
import { cookies } from "next/headers";
import { QUERY_BUILDER_GUIDANCE_COOKIE } from "@/config/internals";
import { buildQueryHistoryParams } from "@/utils/params";
import { DEFAULT_QUERIES_DROPDOWN_PER_PAGE } from "@/config/defaults";
import CohortBuilderClient from "./CohortBuilderClient";

const CohortBuilder = async (props: { query?: string }) => {
  const cookieStore = await cookies();
  const cookie = cookieStore?.get(QUERY_BUILDER_GUIDANCE_COOKIE);

  const searchParamsObject = buildQueryHistoryParams({
    page: 1,
    per_page: DEFAULT_QUERIES_DROPDOWN_PER_PAGE,
    sort: "created_at:desc",
  });

  const [query, { data: userQueries }] = await Promise.all([
    props.query ? getQuery(props.query) : null,
    getQueries({ params: searchParamsObject }),
  ]);

  return (
    <CohortBuilderClient
      initialShowGuidance={!cookie?.value}
      userQueries={userQueries.data}
      query={query?.data}
    />
  );
};

export default CohortBuilder;
