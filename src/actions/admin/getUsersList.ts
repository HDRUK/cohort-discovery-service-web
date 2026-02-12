"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { ApiResponse } from "../../types/api";
import { User } from "@/types/api";
import { TAG_ADMIN_USERS } from "@/config/tags";

const getUsersList = async (): Promise<ApiResponse<User[]>> => {
  return await apiGet<ApiResponse<User[]>>({
    url: API_ROUTES.users,
    tags: [TAG_ADMIN_USERS],
  });
};

export default getUsersList;
