import { QueryClient, QueryKey } from "@tanstack/react-query";

export const setQueryDataIfNewer = <T>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  data: T,
  fetchedAt: number,
): void => {
  const cachedAt = queryClient.getQueryState(queryKey)?.dataUpdatedAt ?? 0;
  if (fetchedAt <= cachedAt) return;

  queryClient.setQueryData(queryKey, data, { updatedAt: fetchedAt });
};
