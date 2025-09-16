"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import {
  CreateCollectionHost,
  CreateCollectionHostPost,
  ApiResponse,
} from "../types/api";

const createCollectionHost = async (
  custodian_id: number,
  name: string,
  context: string
): Promise<ApiResponse<CreateCollectionHost>> => {
  return await apiPost<
    ApiResponse<CreateCollectionHost>,
    CreateCollectionHostPost
  >(API_ROUTES.collectionHosts, {
    name,
    query_context_type: context,
    custodian_id,
  });
};

export default createCollectionHost;
