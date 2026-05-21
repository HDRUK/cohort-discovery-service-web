"use server";

import { apiPut } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, TransitionCollectionPut, ApiResponse } from "@/types/api";
import { revalidateCollections } from "@/actions/revalidate";

const transitionCollections = async (
  ids: number[],
  payload: TransitionCollectionPut,
  custodianPid?: string,
  refreshCache = true,
): Promise<void> => {
  await Promise.all(
    ids.map((id) =>
      apiPut<ApiResponse<Collection>, TransitionCollectionPut>(
        `${API_ROUTES.collection(id)}/transition_to`,
        payload,
      ),
    ),
  );
  if (refreshCache) await revalidateCollections(custodianPid);
};
export default transitionCollections;
