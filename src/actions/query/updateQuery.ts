"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Query, CreateQueryPost, ApiResponse } from "@/types/api";
import { revalidateAction } from "@/actions/revalidate";
import { getTagQuery, TAG_QUERIES } from "@/config/tags";

const updateQuery = async (
  id: number,
  pid: string,
  payload: Partial<CreateQueryPost>,
): Promise<ApiResponse<Query>> => {
  const result = await apiPut<ApiResponse<Query>, Partial<CreateQueryPost>>(
    `${API_ROUTES.query}/${id}`,
    payload,
  );
  await revalidateAction(TAG_QUERIES);
  await revalidateAction(getTagQuery(pid));
  return result;
};

export default updateQuery;
