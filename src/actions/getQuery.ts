"use server";

import { getTagsQuery } from "@/config/tags";
import { apiGet, CachedGetArgs } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getQuery = async (
  pid: string,
  args?: Omit<CachedGetArgs, "url">,
): Promise<ApiResponse<Query>> => {
  return await apiGet<ApiResponse<Query>>({
    url: API_ROUTES.getQuery(pid),
    tags: [pid, ...getTagsQuery(pid)],
    ...args,
  });
};

export default getQuery;
