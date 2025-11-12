"use server";

import { RuleGroupType } from "@/types/rules";
import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { CreateQuery, CreateQueryPost, ApiResponse } from "../types/api";

const MAX_NAME_LEN = 255;

const capToChars = (s: string, max = MAX_NAME_LEN) =>
  [...s].slice(0, max).join("");

const submitQuery = async (
  query: RuleGroupType,
  queryName: string,
  collection_filter?: string[]
): Promise<ApiResponse<CreateQuery>> => {
  const safeName = capToChars(queryName, MAX_NAME_LEN);
  return await apiPost<ApiResponse<CreateQuery>, CreateQueryPost>(
    API_ROUTES.queries,
    {
      name: safeName,
      definition: query,
      task_type: "a",
      ...(collection_filter && { collection_filter }),
    }
  );
};

export default submitQuery;
