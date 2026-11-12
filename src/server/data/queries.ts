import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { requireSession } from "@/server/session";
import {
  ApiResponse,
  Paginated,
  Query,
  ReadArgs,
  WithIncomplete,
} from "@/types/api";

export const getQueries = async (
  args?: ReadArgs,
): Promise<WithIncomplete<ApiResponse<Paginated<Query>>>> => {
  const { token } = await requireSession();
  const { data, message } = await apiGet<ApiResponse<Paginated<Query>>>(
    token,
    API_ROUTES.queries,
    { params: args?.params },
  );

  return {
    data,
    message,
    hasIncomplete: data.data.some((q) => q.tasks.some((t) => !t.completed_at)),
  };
};

export const getQuery = async (
  pid: string,
  args?: ReadArgs,
): Promise<ApiResponse<Query>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Query>>(token, API_ROUTES.getQuery(pid), {
    params: args?.params,
  });
};
