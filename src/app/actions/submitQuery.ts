"use server";

import { RuleGroupType } from "react-querybuilder";
import { apiPost } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { CreateQuery, CreateQueryPost, ApiResponse } from "../types/api";

const submitQuery = async (
  query: RuleGroupType
): Promise<ApiResponse<CreateQuery>> => {
  return await apiPost<ApiResponse<CreateQuery>, CreateQueryPost>(
    API_ROUTES.task,
    {
      name: "test-task",
      definition: query,
      task_type: "a",
    }
  );
};

export default submitQuery;
