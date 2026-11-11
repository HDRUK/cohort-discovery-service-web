"use server";

import { refresh } from "next/cache";
import { apiDelete } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { ApiResponse, RemoveCustodiansFromNetworkPost } from "@/types/api";

const removeCustodiansFromNetwork = async (
  payload: RemoveCustodiansFromNetworkPost,
): Promise<number[]> => {
  const { token } = await requireSession();
  const results = await Promise.all(
    payload.custodian_ids.map(async (custodian_id) =>
      apiDelete<ApiResponse<number>>(
        token,
        API_ROUTES.custodianNetwork(custodian_id, payload.id),
      ),
    ),
  );
  refresh();
  return results.map((r) => r.data);
};

export default removeCustodiansFromNetwork;
