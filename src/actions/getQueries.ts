"use server";

import { getTagQueries } from "@/config/tags";
import { apiGet, CachedGetArgs } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse, Paginated, WithIncomplete } from "../types/api";
import { getTokenUser } from "@/lib/auth";

const getQueries = async (
  args?: Omit<CachedGetArgs, "url">
): Promise<WithIncomplete<ApiResponse<Paginated<Query[]>>>> => {
  const {
    user: { id: userId },
  } = await getTokenUser();

  const { data, message } = await apiGet<ApiResponse<Paginated<Query[]>>>({
    url: API_ROUTES.queries,
    tags: getTagQueries(userId),
    ...args,
  });

  const incompleteQueries = data.data.filter((q) =>
    q.tasks.some((t) => !t.completed_at)
  );

  return {
    data,
    message,
    hasIncomplete: incompleteQueries.length > 0,
  };
};

export default getQueries;
