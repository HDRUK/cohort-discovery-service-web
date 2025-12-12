"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import {
  Collection,
  AddCollectionToWorkgroupPost,
  ApiResponse,
} from "../types/api";

const addCollectionToWorkgroup = async (
  payload: AddCollectionToWorkgroupPost
): Promise<ApiResponse<Collection>> => {
  console.log("payload", payload);
  return await apiPost<ApiResponse<Collection>, AddCollectionToWorkgroupPost>(
    `${API_ROUTES.collection(payload.id)}/workgroup`,
    payload
  );
};

export default addCollectionToWorkgroup;
