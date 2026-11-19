import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import { ApiResponse, Task } from "@/types/api";

export const getTask = async (pid: string): Promise<ApiResponse<Task>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<Task>>(token, API_ROUTES.getTask(pid), {
    errorMode: ErrorMode.RESULT,
  });
};
