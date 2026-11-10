import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ReadOptions } from "@/server/api";
import { requireSession } from "@/server/session";
import { ApiResponse, Paginated, Query, WithIncomplete } from "@/types/api";

export const getQueries = async (
  args?: ReadOptions,
): Promise<WithIncomplete<ApiResponse<Paginated<Query>>>> => {
  const { token } = await requireSession();
  const { data, message, error } = await apiGet<ApiResponse<Paginated<Query>>>(
    token,
    API_ROUTES.queries,
    {
      params: args?.params,
      errorMode: args?.errorMode,
    },
  );

  return {
    data,
    message,
    error,
    hasIncomplete:
      data?.data.some((q) => q.tasks.some((t) => !t.completed_at)) ?? false,
  };
};

export const getQuery = async (
  pid: string,
  args?: ReadOptions,
): Promise<ApiResponse<Query>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Query>>(token, API_ROUTES.getQuery(pid), {
    params: args?.params,
    errorMode: args?.errorMode,
  });
};
