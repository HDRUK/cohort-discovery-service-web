"use server";

import { apiGet } from "../../lib/apiClient";
import { API_ROUTES } from "../../lib/apiRoutes";
import { ApiResponse, Paginated } from "../../types/api";
import { UserList } from "@/types/api";

const getSearchUsers = async (
  term: string,
): Promise<ApiResponse<Paginated<UserList[]>>> => {
  const { data, message } = await apiGet<ApiResponse<Paginated<UserList[]>>>(
    `${API_ROUTES.users}?name[]=${term}&email[]=${term}`,
    {
      next: {
        revalidate: 60,
        tags: [
            "all",
            "admin",
            `admin-users-search-${term}`,
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

export default getSearchUsers;
