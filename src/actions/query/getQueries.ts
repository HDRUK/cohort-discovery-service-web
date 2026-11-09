"use server";

import { getUserQueryTag, TAG_QUERIES } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  Query,
  ApiResponse,
  Paginated,
  WithIncomplete,
  ReadArgs,
} from "@/types/api";
import { getTokenUser } from "@/lib/auth";

const getQueries = async (
  args?: ReadArgs,
): Promise<WithIncomplete<ApiResponse<Paginated<Query>>>> => {
  const {
    user: { id: userId },
  } = await getTokenUser();

  const { data, message } = await apiGet<ApiResponse<Paginated<Query>>>({
    url: API_ROUTES.queries,
    tags: [TAG_QUERIES, getUserQueryTag(userId)],
    params: args?.params,
    cacheOptions: args?.cacheOptions,
  });

  const incompleteQueries = data.data.filter((q) =>
    q.tasks.some((t) => !t.completed_at),
  );

  return {
    data,
    message,
    hasIncomplete: incompleteQueries.length > 0,
  };
};

export default getQueries;
