"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";

const getQuery = async (
  pid: string,
  searchParams?: URLSearchParams,
  useCache: boolean = true
): Promise<ApiResponse<Query>> => {
  const baseUrl = API_ROUTES.getQuery(pid);
  const url = searchParams ? `${baseUrl}?${searchParams.toString()}` : baseUrl;

  return await apiGet<ApiResponse<Query>>(url, {
    next: {
      tags: ["query", pid, `query-${pid}-${searchParams?.toString()}`],
    },
    cache: useCache ? "force-cache" : undefined,
  });
};

export default getQuery;
