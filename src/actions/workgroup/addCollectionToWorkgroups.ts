"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddCollectionToWorkgroupsPost, ApiResponse } from "@/types/api";

const addCollectionToWorkgroups = async (
  payload: AddCollectionToWorkgroupsPost,
): Promise<ApiResponse<number>[]> => {
  return await Promise.all(
    payload.workgroup_ids.map(async (workgroup_id) =>
      apiPost<ApiResponse<number>, { workgroup_id: number }>(
        `${API_ROUTES.collection(payload.id)}/workgroup`,
        { workgroup_id: workgroup_id },
      ),
    ),
  );
};

export default addCollectionToWorkgroups;
