import type { QueryKey } from "@tanstack/react-query";

export const TAG_COLLECTIONS_ADMIN = "collection-admin";
export const TAG_CUSTODIAN_COLLECTION = "custodian-collection";
export const TAG_COLLECTIONS = "collections";
export const TAG_COLLECTIONS_USER = "collections-user";
export const TAG_COLLECTION_HOSTS = "collection-hosts";
export const TAG_QUERIES = "queries";

export const getCollectionHostTag = (custodianPid: string) =>
  `collection-host-${custodianPid}`;

export const getTagCollection = (pid: string) => `${TAG_COLLECTIONS}-${pid}`;

export const TAG_CUSTODIANS = "custodians";
export const TAG_NETWORKS = "custodians-networks";

export const getCustodianTag = (pid: string) => `custodian-${pid}`;

export const TAG_WORKGROUP_ADMIN = "workgroups-admin";

export const getTagCustodianCollection = (pid: string) =>
  `${TAG_CUSTODIAN_COLLECTION}-${pid}`;

export const getUserQueryTag = (id: string | number) => {
  return `${TAG_QUERIES}-${id}`;
};

export const TAG_ADMIN_USERS = "admin-users";
export const TAG_USER_PROFILE = "user-profile";

export const getTagUserProfile = (userId: string | number) =>
  `${TAG_USER_PROFILE}-${userId}`;

type TimeRangeKey = { from: string; to: string };

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
