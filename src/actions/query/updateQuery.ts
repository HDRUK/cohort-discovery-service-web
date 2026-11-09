"use server";

import { refresh } from "next/cache";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Query, CreateQueryPost, ApiResponse } from "@/types/api";

const updateQuery = async (
  id: number,
  payload: Partial<CreateQueryPost>,
): Promise<ApiResponse<Query>> => {
  const { token } = await requireSession();
  const result = await apiPut<ApiResponse<Query>, Partial<CreateQueryPost>>(
    token,
    API_ROUTES.updateQuery(id),
    payload,
  );
  refresh();
  return result;
};

export default updateQuery;
