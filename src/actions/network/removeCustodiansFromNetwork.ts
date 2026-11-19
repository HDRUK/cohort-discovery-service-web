"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
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
  updateTag(CACHE_TAGS.custodians);
  updateTag(CACHE_TAGS.collections);
  return results.map((r) => r.data);
};

export default removeCustodiansFromNetwork;
