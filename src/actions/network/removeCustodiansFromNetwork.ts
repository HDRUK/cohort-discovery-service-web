"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RemoveCustodiansFromNetworkPost } from "@/types/api";

const removeCustodiansFromNetwork = async (
  payload: RemoveCustodiansFromNetworkPost,
): Promise<ApiResponse<number>[]> =>
  await Promise.all(
    payload.custodian_ids.map(async (custodian_id) =>
      apiDelete<ApiResponse<number>>(
        `${API_ROUTES.custodian(custodian_id)}/networks/${payload.id}`,
      ),
    ),
  );

export default removeCustodiansFromNetwork;
