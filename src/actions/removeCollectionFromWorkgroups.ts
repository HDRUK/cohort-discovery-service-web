"use server";

import { apiDelete } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { RemoveCollectionFromWorkgroupsPost, ApiResponse } from "../types/api";

const removeCollectionFromWorkgroups = async (
  payload: RemoveCollectionFromWorkgroupsPost
): Promise<void> => {
  await Promise.all(
    payload.workgroup_ids.map(async (workgroup_id) =>
      apiDelete<ApiResponse<number>>(
        `${API_ROUTES.collection(payload.id)}/workgroup/${workgroup_id}`
      )
    )
  );
};

export default removeCollectionFromWorkgroups;
