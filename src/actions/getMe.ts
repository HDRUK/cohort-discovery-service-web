"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Query, ApiResponse } from "../types/api";
import crypto from "crypto";

function tokenKey(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const getMe = async (token: string): Promise<ApiResponse<Query>> => {
  const key = tokenKey(token);
  return await apiGet<ApiResponse<Query>>(API_ROUTES.getMe, {
    next: {
      revalidate: 60,
      tags: ["all", key],
    },
    cache: "force-cache",
  });
};

export default getMe;
