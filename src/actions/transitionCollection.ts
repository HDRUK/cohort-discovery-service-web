"use server";

import { apiPut } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, TransitionCollectionPut, ApiResponse } from "../types/api";

const transitionCollection = async (
  id: number,
  payload: TransitionCollectionPut
): Promise<ApiResponse<Collection>> => {
  return await apiPut<ApiResponse<Collection>, TransitionCollectionPut>(
    `${API_ROUTES.collection(id)}/transition_to`,
    payload
  );
};

export default transitionCollection;
