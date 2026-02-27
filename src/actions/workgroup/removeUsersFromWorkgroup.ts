"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RemoveUsersFromWorkgroupPost } from "@/types/api";

const removeUserFromWorkgroup = async (
  payload: RemoveUsersFromWorkgroupPost,
): Promise<void> => {
  await Promise.all(
    payload.ids.map(async (id) =>
      apiDelete<ApiResponse<number>>(
        `${API_ROUTES.user(id)}/workgroup/${payload.workgroup_id}`,
      ),
    ),
  );
};

export default removeUserFromWorkgroup;
