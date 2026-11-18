import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { routes } from "@/config/routes";
import { QUERY_KEYS } from "@/config/tags";
import { routeGet } from "@/lib/routeFetch";
import {
  ApiResponse,
  CollectionMetadataRecord,
  CollectionSchema,
} from "@/types/api";

export const useCollectionSchema = (): UseQueryResult<CollectionSchema> =>
  useQuery({
    queryKey: QUERY_KEYS.collectionSchema(),
    queryFn: async () => {
      const { data } = await routeGet<ApiResponse<CollectionSchema>>(
        routes.api.collectionSchema,
      );
      return data;
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

export const useCollectionMetadata = (
  pid: string,
): UseQueryResult<CollectionMetadataRecord> =>
  useQuery({
    queryKey: QUERY_KEYS.collectionMetadata(pid),
    queryFn: async () => {
      const { data } = await routeGet<ApiResponse<CollectionMetadataRecord>>(
        routes.api.collectionMetadata(pid),
      );
      return data;
    },
    enabled: !!pid,
    refetchOnWindowFocus: false,
  });
