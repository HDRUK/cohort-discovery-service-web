"use server";

import { refresh } from "next/cache";
import { apiPut } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { Collection, TransitionCollectionPut, ApiResponse } from "@/types/api";

const transitionCollections = async (
  ids: number[],
  payload: TransitionCollectionPut,
  refreshCache = true,
): Promise<void> => {
  const { token } = await requireSession();
  await Promise.all(
    ids.map((id) =>
      apiPut<ApiResponse<Collection>, TransitionCollectionPut>(
        token,
        API_ROUTES.transitionCollection(id),
        payload,
      ),
    ),
  );
  if (refreshCache) refresh();
};
export default transitionCollections;
