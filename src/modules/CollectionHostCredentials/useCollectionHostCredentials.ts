import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { routes } from "@/config/routes";
import { QUERY_KEYS } from "@/config/tags";
import { routeGet } from "@/lib/routeFetch";
import { CollectionHostCredentials } from "@/types/api";

/**
 * Fetches one host's credentials from the collection-hosts Route Handler. See
 * src/app/api/collection-hosts/[id]/route.ts for why this isn't 'use cache'.
 * staleTime and gcTime are 0 so the browser keeps nothing once the panel
 * unmounts.
 */
const useCollectionHostCredentials = (
  hostId: number,
): UseQueryResult<CollectionHostCredentials> =>
  useQuery({
    queryKey: QUERY_KEYS.collectionHostCredentials(hostId),
    queryFn: () =>
      routeGet<CollectionHostCredentials>(
        routes.api.collectionHostCredentials(hostId),
      ),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

export default useCollectionHostCredentials;
