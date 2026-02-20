"use server";

import { apiDelete } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { ApiResponse, RemoveCollectionsFromWorkgroupPost } from "../types/api";

const removeCollectionsFromWorkgroup = async (
  payload: RemoveCollectionsFromWorkgroupPost,
): Promise<void> => {
  await Promise.all(
    payload.ids.map(async (id) =>
      apiDelete<ApiResponse<number>>(
        `${API_ROUTES.collection(id)}/workgroup/${payload.workgroup_id}`,
      ),
    ),
  );
};

export default removeCollectionsFromWorkgroup;
