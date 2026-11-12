import type { QueryKey } from "@tanstack/react-query";

type TimeRangeKey = { from: string; to: string };

export const CACHE_TAGS = {
  collections: "collections",
  collectionHosts: "collection-hosts",
  conceptSets: "concept-sets",
  currentUser: "current-user",
  custodians: "custodians",
  features: "features",
  networks: "networks",
  users: "users",
  workgroups: "workgroups",
} as const;

const queryKey = (...parts: unknown[]): QueryKey =>
  parts.filter((part) => part !== undefined);

export const QUERY_KEYS = {
  queries: (params?: string) => queryKey("queries", params),
  query: (pid?: string, params?: string) => queryKey("query", pid, params),
  task: (pid: string) => queryKey("task", pid),
  collectionDetails: (pid?: string) => queryKey("collection-details", pid),
  collectionHealthRows: (pid?: string) =>
    queryKey("collection-health", "rows", pid),
  collectionHealthSeries: (pid: string, bin: string, range: TimeRangeKey) =>
    queryKey("collection-health", "series", pid, bin, range.from, range.to),
  collectionTaskHistory: (pid: string, range: TimeRangeKey) =>
    queryKey("collection-health", "task-history", pid, range.from, range.to),
  regressionTests: () => queryKey("regression-tests"),
  demographics: (userId?: number, collectionPids?: string[]) =>
    queryKey("demographics", userId, collectionPids),
  cohortRules: (
    text?: string,
    includeSynthetic?: boolean,
    selectedDatasets?: string[],
  ) => queryKey("cohort-rules", text, includeSynthetic, selectedDatasets),
  collectionHostCredentials: (hostId: number) =>
    queryKey("collection-host-credentials", hostId),
};
