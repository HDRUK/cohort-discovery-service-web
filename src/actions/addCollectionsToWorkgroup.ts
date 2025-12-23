"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { AddCollectionsToWorkgroupPost, ApiResponse } from "../types/api";

const addCollectionsToWorkgroup = async (
  payload: AddCollectionsToWorkgroupPost
): Promise<ApiResponse<number>[]> => {
  return await Promise.all(
    payload.ids.map(async (id) =>
      apiPost<ApiResponse<number>, AddCollectionsToWorkgroupPost>(
        `${API_ROUTES.collection(id)}/workgroup`,
        payload
      )
    )
  );
};

export default addCollectionsToWorkgroup;
