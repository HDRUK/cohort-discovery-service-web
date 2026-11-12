import { QueryClient, QueryKey } from "@tanstack/react-query";

const firstSeenAt = new WeakMap<object, number>();

export const receivedAt = (payload: object): number => {
  const seenAt = firstSeenAt.get(payload);
  if (seenAt !== undefined) return seenAt;

  const now = Date.now();
  firstSeenAt.set(payload, now);
  return now;
};

export const setQueryDataIfNewer = <T extends object>(
  queryClient: QueryClient,
  queryKey: QueryKey,
  data: T,
): void => {
  const stamp = receivedAt(data);
  const cachedAt = queryClient.getQueryState(queryKey)?.dataUpdatedAt ?? 0;
  if (stamp <= cachedAt) return;

  queryClient.setQueryData(queryKey, data, { updatedAt: stamp });
};
