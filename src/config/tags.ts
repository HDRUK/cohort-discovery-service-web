export const TAG_COLLECTIONS_ADMIN = "collection-admin";
export const TAG_CUSTODIAN_COLLECTION = "custodian-collection";
export const TAG_COLLECTIONS = "collections";
export const TAG_COLLECTIONS_USER = "collections-user";
export const TAG_COLLECTION_HOSTS = "collection-hosts";
export const TAG_QUERIES = "queries";

export const getCollectionHostTag = (custodianPid: string) =>
  `collection-host-${custodianPid}`;

export const getTagsCollectionHostCredentials = (hostId: number) => [
  TAG_COLLECTION_HOSTS,
  "credentials",
  hostId,
];

export const getTagsUserCollections = (userId: string | number) =>
  `${TAG_COLLECTIONS_USER}-${userId}`;

export const getTagCollection = (pid: string) => `${TAG_COLLECTIONS}-${pid}`;

export const TAG_CUSTODIANS = "custodians";
export const TAG_NETWORKS = "custodians-networks";

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

export const getUserQueryTag = (id: string | number) => {
  return `${TAG_QUERIES}-${id}`;
};

export const getTagQuery = (pid: string) => `query-${pid}`;

export const getTagsQuery = (pid: string) => ["query", getTagQuery(pid)];

export const TAG_REGRESSION_TESTS = "regression-tests";
export const TAG_REGRESSION_TASK = "regression-task";
export const getTagRegressionTest = (pid: string) => `regression-test-${pid}`;

export const TAG_USERS = "users";
export const TAG_ADMIN_USERS = "admin-users";
export const TAG_USER_PROFILE = "user-profile";

export const getTagUserProfile = (userId: string | number) =>
  `${TAG_USER_PROFILE}-${userId}`;

export const getTagTermDirectory = (userId: string | number) =>
  `term-directory-${userId}`;

export const TAG_COLLECTION_HEALTH = "collection-health";

export const getTagsCollectionHealth = (
  pid: string,
  bin: string,
  range: { from: string; to: string },
) => [TAG_COLLECTION_HEALTH, "series", pid, bin, range.from, range.to];

export const getTagsCollectionTaskHistory = (
  pid: string,
  range: { from: string; to: string },
) => [TAG_COLLECTION_HEALTH, "task-history", pid, range.from, range.to];

export const getTagsCollectionHealthRows = (pid?: string) => [
  TAG_COLLECTION_HEALTH,
  TAG_COLLECTIONS_ADMIN,
  ...(pid ? [pid] : []),
];

export const TAGS_REGRESSION_TESTS = [TAG_REGRESSION_TESTS];

const ALLOWED_TAGS = new Set<string>([
  TAG_COLLECTIONS_ADMIN,
  TAG_CUSTODIAN_COLLECTION,
  TAG_COLLECTIONS,
  TAG_COLLECTIONS_USER,
  TAG_COLLECTION_HOSTS,
  TAG_QUERIES,
  TAG_CUSTODIANS,
  TAG_NETWORKS,
  TAG_WORKGROUP_ADMIN,
  TAG_CONCEPT_SETS,
  TAG_FEATURE_FLAGS,
  TAG_LATEST_QUERY,
  TAG_REGRESSION_TESTS,
  TAG_REGRESSION_TASK,
  TAG_USERS,
  TAG_ADMIN_USERS,
  TAG_USER_PROFILE,
  TAG_COLLECTION_HEALTH,
  ...getTagCodeStats(),
]);

const ALLOWED_TAG_PREFIXES = [
  getCollectionHostTag(""),
  getTagsUserCollections(""),
  getTagCollection(""),
  getCustodianTag(""),
  getTagCustodianCollection(""),
  getTagConceptSets(""),
  getUserQueryTag(""),
  getTagQuery(""),
  getTagRegressionTest(""),
  getTagUserProfile(""),
  getTagTermDirectory(""),
];

const TAG_ID_SUFFIX = /^[\w-]{1,64}$/;

export const isAllowedTag = (tag: string): boolean =>
  ALLOWED_TAGS.has(tag) ||
  ALLOWED_TAG_PREFIXES.some(
    (prefix) =>
      tag.startsWith(prefix) && TAG_ID_SUFFIX.test(tag.slice(prefix.length)),
  );
