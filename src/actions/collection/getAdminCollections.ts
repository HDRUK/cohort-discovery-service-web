"use server";

import { getAdminCollections as readAdminCollections } from "@/server/data/collections";
import {
  ApiResponse,
  CollectionWithHosts,
  Paginated,
  ReadArgs,
} from "@/types/api";

const getAdminCollections = async (
  args?: ReadArgs,
): Promise<ApiResponse<Paginated<CollectionWithHosts>>> =>
  readAdminCollections({ params: args?.params });

export default getAdminCollections;
