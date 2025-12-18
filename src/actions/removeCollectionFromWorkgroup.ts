"use server";

import { apiDelete } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { RemoveCollectionFromWorkgroupPost, ApiResponse } from "../types/api";

const removeCollectionFromWorkgroup = async (
  payload: RemoveCollectionFromWorkgroupPost
): Promise<ApiResponse<number>> => {
  return await apiDelete<ApiResponse<number>>(
    `${API_ROUTES.collection(payload.id)}/workgroup/${payload.workgroup_id}`
  );
};

export default removeCollectionFromWorkgroup;
