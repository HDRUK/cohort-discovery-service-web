"use server";

import { apiDelete } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RemoveCustodiansFromNetworkPost } from "@/types/api";
import { revalidateNetworks } from "@/actions/revalidate";

const removeCustodiansFromNetwork = async (
  payload: RemoveCustodiansFromNetworkPost,
): Promise<number[]> => {
  const results = await Promise.all(
    payload.custodian_ids.map(async (custodian_id) =>
      apiDelete<ApiResponse<number>>(
        `${API_ROUTES.custodian(custodian_id)}/networks/${payload.id}`,
      ),
    ),
  );
  await revalidateNetworks();
  return results.map((r) => r.data);
};

export default removeCustodiansFromNetwork;
