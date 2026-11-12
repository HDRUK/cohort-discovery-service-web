"use server";

import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { requireSession } from "@/server/session";
import { ApiResponse, User } from "@/types/api";

const getSearchUsers = async (term?: string): Promise<ApiResponse<User[]>> => {
  const { token } = await requireSession();
  const params = new URLSearchParams(
    term
      ? {
          "name[]": term,
          "email[]": term,
        }
      : {},
  );

  return apiGet<ApiResponse<User[]>>(token, API_ROUTES.users, { params });
};

export default getSearchUsers;
