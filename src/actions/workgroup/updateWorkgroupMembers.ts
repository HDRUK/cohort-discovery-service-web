"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPost, ErrorMode } from "@/server/api";
import {
  editFailures,
  runMemberEdit,
} from "@/server/mutations/workgroupMembers";
import { requireSession } from "@/server/session";
import { MembershipEditResult } from "@/types/accessPolicy";
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
): Promise<MembershipEditResult> => {
  const { token } = await requireSession();

  const [userResponses, collectionResponses] = await Promise.all([
    Promise.all(
      userIds.map((userId) =>
        runMemberEdit(userId, () =>
          apiPost<ApiResponse<number>, AddUsersToWorkgroupPost>(
            token,
            API_ROUTES.userWorkgroups(userId),
            { workgroup_id: workgroupId },
            { errorMode: ErrorMode.RESULT },
          ),
        ),
      ),
    ),
    Promise.all(
      collectionIds.map((collectionId) =>
        runMemberEdit(collectionId, () =>
          apiPost<ApiResponse<number>, AddCollectionsToWorkgroupPost>(
            token,
            API_ROUTES.collectionWorkgroups(collectionId),
            { ids: collectionIds, workgroup_id: workgroupId },
            { errorMode: ErrorMode.RESULT },
          ),
        ),
      ),
    ),
  ]);

  updateTag(CACHE_TAGS.workgroups);
  updateTag(CACHE_TAGS.users);
  updateTag(CACHE_TAGS.currentUser);
  updateTag(CACHE_TAGS.collections);

  return {
    failed: editFailures(userResponses),
    failedCollections: editFailures(collectionResponses),
  };
};

export default updateWorkgroupMembers;
