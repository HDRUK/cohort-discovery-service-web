"use server";

import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { AddCustodiansToNetworkPost, ApiResponse } from "../types/api";

const addCustodiansToNetwork = async (
  payload: AddCustodiansToNetworkPost,
): Promise<ApiResponse<number>[]> => {
  return await Promise.all(
    payload.custodian_ids.map(async (custodian_id) =>
      apiPost<ApiResponse<number>, AddCustodiansToNetworkPost>(
        `${API_ROUTES.custodian(custodian_id)}/networks/${payload.id}`,
        payload,
      ),
    ),
  );
};

export default addCustodiansToNetwork;
