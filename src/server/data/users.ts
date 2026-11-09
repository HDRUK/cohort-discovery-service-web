import "server-only";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { requireSession } from "@/server/session";
import { ApiResponse, User } from "@/types/api";

export const getUsersList = async (): Promise<ApiResponse<User[]>> => {
  const { token } = await requireSession();
  return apiGet<ApiResponse<User[]>>(token, API_ROUTES.users);
};
