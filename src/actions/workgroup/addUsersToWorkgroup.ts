"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddUsersToWorkgroupPost, ApiResponse } from "@/types/api";
import { revalidateWorkgroupAndCollections } from "@/actions/revalidate";

const addUsersToWorkgroup = async (
  payload: AddUsersToWorkgroupPost,
): Promise<number[]> => {
  const results = await Promise.all(
    payload.ids.map(async (id) =>
      apiPost<ApiResponse<number>, AddUsersToWorkgroupPost>(
        `${API_ROUTES.user(id)}/workgroup`,
        payload,
      ),
    ),
  );
  await revalidateWorkgroupAndCollections(true);
  return results.map((r) => r.data);
};

export default addUsersToWorkgroup;
