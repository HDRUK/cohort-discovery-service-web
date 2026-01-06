"use server";

import { apiPut } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, TransitionCollectionPut, ApiResponse } from "../types/api";

const transitionCollections = async (
  ids: number[],
  payload: TransitionCollectionPut
): Promise<ApiResponse<Collection>[]> => {
  return await Promise.all(
    ids.map((id) =>
      apiPut<ApiResponse<Collection>, TransitionCollectionPut>(
        `${API_ROUTES.collection(id)}/transition_to`,
        payload
      )
    )
  );
};

export default transitionCollections;
