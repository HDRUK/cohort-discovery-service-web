"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { ApiResponse } from "../../types/api";
import { User } from "@/types/api";

const getSearchUsers = async (term?: string): Promise<ApiResponse<User[]>> => {
  const { data, message } = await apiGet<ApiResponse<User[]>>(
    term
      ? `${API_ROUTES.users}?name[]=${term}&email[]=${term}`
      : API_ROUTES.users,
    {
      next: {
        revalidate: 60,
        tags: ["all", "admin", `admin-users-search-${term}`],
      },
      cache: "force-cache",
    }
  );

  return {
    data,
    message,
  };
};

export default getSearchUsers;
