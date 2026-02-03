"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { AddUsersToWorkgroupPost, ApiResponse } from "../types/api";

const addUsersToWorkgroup = async (
  payload: AddUsersToWorkgroupPost,
): Promise<ApiResponse<number>[]> => {
  return await Promise.all(
    payload.ids.map(async (id) =>
      apiPost<ApiResponse<number>, AddUsersToWorkgroupPost>(
        `${API_ROUTES.user(id)}/workgroup`,
        payload,
      ),
    ),
  );
};

export default addUsersToWorkgroup;
