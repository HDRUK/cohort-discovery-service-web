"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { AddCustodianToNetworkPost, ApiResponse } from "../types/api";

const addCustodiansToNetwork = async (
  payload: AddCustodianToNetworkPost,
): Promise<ApiResponse<number>[]> => {
  return await Promise.all(
    payload.custodian_ids.map(async (custodian_id) =>
      apiPost<ApiResponse<number>, AddCustodianToNetworkPost>(
        `${API_ROUTES.custodian(custodian_id)}/networks/${payload.id}`,
        payload,
      ),
    ),
  );
};

export default addCustodiansToNetwork;
