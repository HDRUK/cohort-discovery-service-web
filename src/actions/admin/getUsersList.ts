"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { ApiResponse, Paginated } from "../../types/api";
import {
  DEFAULT_REVALIDATE,
  DEFAULT_USERS_PER_PAGE,
} from "../../config/defaults";
import { User } from "@/types/api";

const getUsersList = async (
  page = 1,
  per_page = DEFAULT_USERS_PER_PAGE
): Promise<ApiResponse<Paginated<User[]>>> => {
  const { data, message } = await apiGet<ApiResponse<Paginated<User[]>>>(
    `${API_ROUTES.users}?page=${page}&per_page=${per_page}`,
    {
      next: {
        revalidate: DEFAULT_REVALIDATE,
        tags: [
          "all",
          "admin",
          "admin-users",
          `admin-users-${page}-${per_page}`,
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
