"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
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

  updateTag(CACHE_TAGS.workgroups);
  updateTag(CACHE_TAGS.users);
  updateTag(CACHE_TAGS.currentUser);
  updateTag(CACHE_TAGS.collections);
};

export default updateWorkgroupMembers;
