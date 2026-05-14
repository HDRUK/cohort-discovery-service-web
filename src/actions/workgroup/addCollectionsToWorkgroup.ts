"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddCollectionsToWorkgroupPost, ApiResponse } from "@/types/api";
import { revalidateWorkgroupAndCollections } from "@/actions/revalidate";

const addCollectionsToWorkgroup = async (
  payload: AddCollectionsToWorkgroupPost,
): Promise<number[]> => {
  const results = await Promise.all(
    payload.ids.map(async (id) =>
      apiPost<ApiResponse<number>, AddCollectionsToWorkgroupPost>(
        `${API_ROUTES.collection(id)}/workgroup`,
        payload,
      ),
    ),
  );
  await revalidateWorkgroupAndCollections();
  return results.map((r) => r.data);
};

export default addCollectionsToWorkgroup;
