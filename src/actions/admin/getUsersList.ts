"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { ApiResponse, Paginated } from "../../types/api";
import { DEFAULT_USERS_PER_PAGE } from "../../config/defaults";
import { User } from "@/types/api";
import { TAG_ADMIN_USERS } from "@/config/tags";

const getUsersList = async (
  page = 1,
  per_page = DEFAULT_USERS_PER_PAGE,
): Promise<ApiResponse<Paginated<User>>> => {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(per_page),
  });

  return await apiGet<ApiResponse<Paginated<User>>>({
    url: API_ROUTES.users,
    params,
    tags: [TAG_ADMIN_USERS],
  });
};

export default getUsersList;
