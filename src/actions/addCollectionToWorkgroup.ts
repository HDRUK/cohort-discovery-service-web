"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { AddCollectionToWorkgroupPost, ApiResponse } from "../types/api";

const addCollectionToWorkgroup = async (
  payload: AddCollectionToWorkgroupPost
): Promise<ApiResponse<number>> => {
  return await apiPost<ApiResponse<number>, AddCollectionToWorkgroupPost>(
    `${API_ROUTES.collection(payload.id)}/workgroup`,
    payload
  );
};

export default addCollectionToWorkgroup;
