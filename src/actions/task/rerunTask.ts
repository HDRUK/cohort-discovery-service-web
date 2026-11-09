"use server";

import { refresh } from "next/cache";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiGet } from "@/server/api";
import { requireSession } from "@/server/session";
import { Task, ApiResponse } from "@/types/api";

const rerunTask = async (pid: string): Promise<ApiResponse<Task>> => {
  const { token } = await requireSession();
  const res = await apiGet<ApiResponse<Task>>(token, API_ROUTES.rerunTask(pid));
  refresh();
  return res;
};

export default rerunTask;
