"use server";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { requireSession } from "@/server/session";
import { ApiResponse, ReadArgs, Tasks } from "@/types/api";

const getTasks = async (args?: ReadArgs): Promise<ApiResponse<Tasks>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Tasks>>(token, API_ROUTES.tasks, {
    params: args?.params,
  });
};

export default getTasks;
