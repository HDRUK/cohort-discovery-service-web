"use server";

import { refresh } from "next/cache";
import { RuleGroupType } from "@/types/rules";
import { apiPost, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import { API_ROUTES } from "@/lib/apiRoutes";
import {
  CreateQuery,
  CreateQueryPost,
  ApiResponse,
  TaskType,
} from "@/types/api";
import { capVarChar } from "@/utils/string";
import { changesQueryQuota } from "@/utils/queryLimit";

const submitQuery = async (
  query: RuleGroupType,
  queryName: string | null,
  collection_filter?: string[],
): Promise<ApiResponse<CreateQuery>> => {
  const { token } = await requireSession();
  const safeName = queryName ? capVarChar(queryName) : null;
  const res = await apiPost<ApiResponse<CreateQuery>, CreateQueryPost>(
    token,
    API_ROUTES.queries,
    {
      name: safeName,
      definition: query,
      task_type: TaskType.A,
      ...(collection_filter && { collection_filter }),
    },
    { errorMode: ErrorMode.RESULT },
  );

  if (changesQueryQuota(res)) refresh();
  return res;
};

export default submitQuery;
