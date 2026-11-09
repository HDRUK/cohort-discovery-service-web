"use server";

import { getQuery as readQuery } from "@/server/data/queries";
import { ApiResponse, Query, ReadArgs } from "@/types/api";

const getQuery = async (
  pid: string,
  args?: ReadArgs,
): Promise<ApiResponse<Query>> => readQuery(pid, { params: args?.params });

export default getQuery;
