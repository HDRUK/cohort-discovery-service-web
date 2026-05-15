"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { RemoveCollectionsFromWorkgroupPost, ApiResponse } from "@/types/api";
import { revalidateWorkgroupAndCollections } from "@/actions/revalidate";

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
  await revalidateWorkgroupAndCollections();
};

export default removeCollectionsFromWorkgroup;
