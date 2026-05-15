"use server";

import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddCustodiansToNetworkPost, ApiResponse } from "@/types/api";
import { revalidateNetworks } from "@/actions/revalidate";

const addCustodiansToNetwork = async (
  payload: AddCustodiansToNetworkPost,
): Promise<number[]> => {
  const results = await Promise.all(
    payload.custodian_ids.map(async (custodian_id) =>
      apiPost<ApiResponse<number>, AddCustodiansToNetworkPost>(
        `${API_ROUTES.custodian(custodian_id)}/networks/${payload.id}`,
        payload,
      ),
    ),
  );
  await revalidateNetworks();
  return results.map((r) => r.data);
};

export default addCustodiansToNetwork;
