"use server";

import { apiGet } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { User, ApiResponse } from "../types/api";

const getMe = async (): Promise<ApiResponse<User>> => {
  return await apiGet<ApiResponse<User>>({ url: API_ROUTES.getMe });
};

export default getMe;
