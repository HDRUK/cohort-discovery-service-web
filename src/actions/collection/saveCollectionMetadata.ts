"use server";

import { updateTag } from "next/cache";
import { CACHE_TAGS } from "@/config/tags";
import { API_ROUTES } from "@/lib/apiRoutes";
import { apiPut, ErrorMode } from "@/server/api";
import { requireSession } from "@/server/session";
import {
  ApiResponse,
  CollectionMetadataDocument,
  CollectionMetadataRecord,
} from "@/types/api";

const isMetadataDocument = (
  value: unknown,
): value is CollectionMetadataDocument =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const saveCollectionMetadata = async (
  id: number,
  metadata: CollectionMetadataDocument,
): Promise<ApiResponse<CollectionMetadataRecord | null>> => {
  if (!Number.isInteger(id) || !isMetadataDocument(metadata)) {
    return {
      message: "Invalid metadata",
      data: null,
      error: { text: "Invalid metadata", code: 400 },
    };
  }

  const { token } = await requireSession();
  const res = await apiPut<
    ApiResponse<CollectionMetadataRecord | null>,
    { metadata: CollectionMetadataDocument }
  >(
    token,
    API_ROUTES.collectionMetadata(id),
    { metadata },
    {
      errorMode: ErrorMode.RESULT,
    },
  );
  updateTag(CACHE_TAGS.collections);
  return res;
};

export default saveCollectionMetadata;
