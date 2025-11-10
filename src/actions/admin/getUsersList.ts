"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { ApiResponse, Paginated } from "../../types/api";
import { DEFAULT_USERS_PER_PAGE } from "../../config/defaults";
import { UserList } from "@/types/api";

const getUsersList = async (
  page = 1,
  per_page = DEFAULT_USERS_PER_PAGE
): Promise<ApiResponse<Paginated<UserList[]>>> => {
  const { data, message } = await apiGet<ApiResponse<Paginated<UserList[]>>>(
    `${API_ROUTES.users}?page=${page}&per_page=${per_page}`,
    {
      next: {
        revalidate: 60,
        tags: [
            "all",
            "admin",
            `admin-users`,
            `admin-users-${page}-${per_page}`
        ],
      },
      cache: "force-cache",
    }
  );

  return {
    data,
    message,
  };
};

export default getUsersList;
