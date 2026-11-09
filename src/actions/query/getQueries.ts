"use server";

import { getQueries as readQueries } from "@/server/data/queries";
import {
  ApiResponse,
  Paginated,
  Query,
  ReadArgs,
  WithIncomplete,
} from "@/types/api";

const getQueries = async (
  args?: ReadArgs,
): Promise<WithIncomplete<ApiResponse<Paginated<Query>>>> =>
  readQueries({ params: args?.params });

export default getQueries;
