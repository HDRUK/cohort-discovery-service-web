"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse, Paginated, WithIncomplete } from "../types/api";
import { DEFAULT_QUERIES_PER_PAGE } from "@/config/defaults";

const getQueries = async (
  page = 1,
  per_page = DEFAULT_QUERIES_PER_PAGE
): Promise<WithIncomplete<ApiResponse<Paginated<Query[]>>>> => {
  const { data, message } = await apiGet<ApiResponse<Paginated<Query[]>>>(
    `${API_ROUTES.queries}?page=${page}&per_page=${per_page}`,
    {
      next: { revalidate: 60, tags: ["queries"] },
      cache: "force-cache",
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
