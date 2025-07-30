"use server";

import { RuleGroupType } from "react-querybuilder";
import apiClient, { handleApiError } from "../lib/apiClient";
import { API_ROUTES } from "../lib/apiRoutes";
import { CreateQuery, ApiResponse } from "../types/api";

const submitQuery = async (
  query: RuleGroupType
): Promise<ApiResponse<CreateQuery>> => {
  try {
    const response = await apiClient.post<ApiResponse<CreateQuery>>(
      API_ROUTES.task,
      {
        name: "test-task",
        definition: query,
        task_type: "a",
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
  }
};

export default submitQuery;
