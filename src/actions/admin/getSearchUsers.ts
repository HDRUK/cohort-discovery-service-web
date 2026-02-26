"use server";

import { TAG_USERS } from "@/config/tags";
import { apiGet } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse } from "@/types/api";
import { User } from "@/types/api";

const getSearchUsers = async (term?: string): Promise<ApiResponse<User[]>> => {
  const params = new URLSearchParams(
    term
      ? {
          "name[]": term,
          "email[]": term,
        }
      : {},
  );

  return await apiGet<ApiResponse<User[]>>({
    url: API_ROUTES.users,
    params,
    tags: [TAG_USERS],
  });
};

export default getSearchUsers;
