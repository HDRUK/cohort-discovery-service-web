"use server";

import { refresh } from "next/cache";
import { apiPost } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import { AddCustodiansToNetworkPost, ApiResponse } from "@/types/api";
import { pick } from "@/utils/pick";

const NETWORK_CUSTODIANS_FIELDS = ["id", "custodian_ids"] as const;

const addCustodiansToNetwork = async (
  payload: AddCustodiansToNetworkPost,
): Promise<number[]> => {
  const { token } = await requireSession();
  try {
    const results = await Promise.all(
      payload.custodian_ids.map(async (custodian_id) =>
        apiPost<ApiResponse<number>, AddCustodiansToNetworkPost>(
          token,
          API_ROUTES.custodianNetwork(custodian_id, payload.id),
          pick(payload, NETWORK_CUSTODIANS_FIELDS),
        ),
      ),
    );
    return results.map((r) => r.data);
  } finally {
    refresh();
  }
};

export default addCustodiansToNetwork;
