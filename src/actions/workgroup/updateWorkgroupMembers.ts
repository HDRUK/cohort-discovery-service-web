"use server";

import { refresh } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import {
  AddCollectionsToWorkgroupPost,
  AddUsersToWorkgroupPost,
  ApiResponse,
} from "@/types/api";

interface WorkgroupMembers {
  userIds: number[];
  collectionIds: number[];
}

const updateWorkgroupMembers = async (
  workgroupId: number,
  { userIds, collectionIds }: WorkgroupMembers,
): Promise<void> => {
  const { token } = await requireSession();

  for (const userId of userIds) {
    await apiPost<ApiResponse<number>, AddUsersToWorkgroupPost>(
      token,
      API_ROUTES.userWorkgroups(userId),
      { ids: userIds, workgroup_id: workgroupId },
    );
  }

  for (const collectionId of collectionIds) {
    await apiPost<ApiResponse<number>, AddCollectionsToWorkgroupPost>(
      token,
      API_ROUTES.collectionWorkgroups(collectionId),
      { ids: collectionIds, workgroup_id: workgroupId },
    );
  }

  refresh();
};

export default updateWorkgroupMembers;
