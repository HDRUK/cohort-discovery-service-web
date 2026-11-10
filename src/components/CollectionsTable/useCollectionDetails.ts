import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { routes } from "@/config/routes";
import { QUERY_KEYS } from "@/config/tags";
import { routeGet } from "@/lib/routeFetch";
import { ApiResponse, CollectionDetails } from "@/types/api";

const DETAILS_STALE_TIME = 30_000;

const useCollectionDetails = (pid: string): UseQueryResult<CollectionDetails> =>
  useQuery({
    queryKey: QUERY_KEYS.collectionDetails(pid),
    queryFn: async () => {
      const { data } = await routeGet<ApiResponse<CollectionDetails>>(
        routes.api.collectionDetails(pid),
      );
      return data;
    },
    enabled: !!pid,
    staleTime: DETAILS_STALE_TIME,
    refetchOnWindowFocus: false,
  });

export default useCollectionDetails;
