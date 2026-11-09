"use server";

import { getTagsQuery } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Query, ApiResponse, ReadArgs } from "@/types/api";

const getQuery = async (
  pid: string,
  args?: ReadArgs,
): Promise<ApiResponse<Query>> => {
  return await apiGet<ApiResponse<Query>>({
    url: API_ROUTES.getQuery(pid),
    tags: [pid, ...getTagsQuery(pid)],
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });
};

export default getQuery;
