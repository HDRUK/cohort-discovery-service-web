export const TAG_COLLECTION_ADMIN = "collection-admin";
export const TAG_CUSTODIAN_COLLECTION = "custodian-collection";
export const TAG_COLLECTIONS = "collections";

export const TAG_COLLECTION_HOSTS = "collection-hosts";

export const getCollectionHostTag = (custodianPid: string) =>
  `collection-host-${custodianPid}`;

export const TAG_CUSTODIANS = "custodians";

export const getCustodianTag = (pid: string) => `custodian-${pid}`;

export const TAG_WORKGROUP_ADMIN = "workgroups-admin";

export const getTagCustodianCollection = (pid: string) =>
  `${TAG_CUSTODIAN_COLLECTION}-${pid}`;

export const getTagConcepts = (domain?: string) => [
  "concepts",
  ...(domain ? `concepts-${domain}` : []),
];

export const getTagCodes = (domain?: string) => [
  "omop-code",
  ...(domain ? `omop-code-${domain}` : []),
];

export const getTagCodeStats = () => ["omop", "omop-stats"];

export const TAG_CONCEPT_SETS = "concept-sets";

export const getTagConceptSets = (userId: string | number) =>
  `${TAG_CONCEPT_SETS}-${userId}`;

export const TAG_FEATURE_FLAGS = "feature-flags";
export const TAG_LATEST_QUERY = "lastest-query";

export const getTagQueries = (userId: number) => [
  "queries",
  `queries-${userId}`,
];

export const getTagsQuery = (pid: string) => ["query", `query-${pid}`];

export const TAG_USERS = "users";
export const TAG_ADMIN_USERS = "admin-users";
