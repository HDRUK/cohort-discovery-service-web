"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { Collection, CreateCollectionPost, ApiResponse } from "../types/api";

const createCustodianCollection = async (
  custodianPid: string,
  payload: CreateCollectionPost,
): Promise<ApiResponse<Collection>> => {
  return await apiPost<ApiResponse<Collection>, CreateCollectionPost>(
    API_ROUTES.custodianCollections(custodianPid),
    payload,
  );
};

export default createCustodianCollection;
