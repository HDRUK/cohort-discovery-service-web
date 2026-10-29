import { skipToken, useQuery, UseQueryResult } from "@tanstack/react-query";
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

const useCollectionHostCredentials = (
  hostId: number | undefined,
): UseQueryResult<CollectionHostCredentials> =>
  useQuery({
    queryKey: getTagsCollectionHostCredentials(hostId),
    queryFn: hostId ? () => fetchCollectionHostCredentials(hostId) : skipToken,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  });

export default useCollectionHostCredentials;
