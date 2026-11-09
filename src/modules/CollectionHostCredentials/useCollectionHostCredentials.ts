import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { routes } from "@/config/routes";
import { getTagsCollectionHostCredentials } from "@/config/tags";
import { CollectionHostCredentials } from "@/types/api";

const fetchCollectionHostCredentials = async (
  hostId: number,
): Promise<CollectionHostCredentials> => {
  const response = await fetch(routes.collectionHostCredentials(hostId), {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`Collection host credentials returned ${response.status}`);
  }
  return response.json();
};

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
    queryKey: getTagsCollectionHostCredentials(hostId),
    queryFn: () => fetchCollectionHostCredentials(hostId),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

export default useCollectionHostCredentials;
