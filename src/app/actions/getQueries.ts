"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse, WithIncomplete } from "../types/api";

const getQueries = async (): Promise<WithIncomplete<ApiResponse<Query[]>>> => {
  const { data, message } = await apiGet<ApiResponse<Query[]>>(
    API_ROUTES.queries,
    {
      next: { revalidate: 60, tags: ["queries"] },
      cache: "force-cache",
    }
  );

  const incompleteQueries = data.filter((q) =>
    q.tasks.some((t) => !t.completed_at)
  );

  return {
    data,
    message,
    hasIncomplete: incompleteQueries.length > 0,
  };
};

export default getQueries;
