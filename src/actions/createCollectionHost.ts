"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import {
  CollectionHost,
  CreateCollectionHostPost,
  ApiResponse,
} from "../types/api";
import { CollectionHostFormValues } from "@/types/forms";

const createCollectionHost = async (
  custodian_id: number,
  { name, context }: CollectionHostFormValues
): Promise<ApiResponse<CollectionHost>> => {
  return await apiPost<ApiResponse<CollectionHost>, CreateCollectionHostPost>(
    API_ROUTES.collectionHosts,
    {
      name,
      query_context_type: context,
      custodian_id,
    }
  );
};

export default createCollectionHost;
