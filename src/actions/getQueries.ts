"use server";

import { DEFAULT_REVALIDATE } from "@/config/defaults";
import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse, Paginated, WithIncomplete } from "../types/api";
import { getTokenUser } from "@/lib/auth";

const getQueries = async (
  searchParams?: URLSearchParams,
  useCache: boolean = true
): Promise<WithIncomplete<ApiResponse<Paginated<Query[]>>>> => {
  const { user } = await getTokenUser();
  const userId = user.id;

  const { data, message } = await apiGet<ApiResponse<Paginated<Query[]>>>(
    searchParams?.toString()
      ? `${API_ROUTES.queries}?${searchParams.toString()}`
      : API_ROUTES.queries,
    {
      next: {
        revalidate: useCache ? DEFAULT_REVALIDATE : undefined,
        tags: [
          "all",
          "queries",
          `${userId}-queries`,
          `${userId}-queries-${searchParams?.toString()}`,
        ],
      },
      cache: useCache ? "force-cache" : "no-store",
    }
  );

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
