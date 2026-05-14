"use server";

import { RuleGroupType } from "@/types/rules";
import { apiPost } from "@/lib/apiClient";
import { API_ROUTES } from "@/lib/apiRoutes";
import { CreateQuery, CreateQueryPost, ApiResponse } from "@/types/api";
import { capVarChar } from "@/utils/string";
import { revalidateUserAction } from "@/actions/revalidate";

const submitQuery = async (
  query: RuleGroupType,
  queryName: string | null,
  collection_filter?: string[],
): Promise<ApiResponse<CreateQuery>> => {
  const safeName = queryName ? capVarChar(queryName) : null;
  const res = await apiPost<ApiResponse<CreateQuery>, CreateQueryPost>(
    API_ROUTES.queries,
    {
      name: safeName,
      definition: query,
      task_type: "a",
      ...(collection_filter && { collection_filter }),
    },
  );
  await revalidateUserAction("queries");
  return res;
};

export default submitQuery;
