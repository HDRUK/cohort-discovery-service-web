import { DownloadEntity, DownloadFormat } from "@/utils/download";

const API_URL = "/api/v1";
const API_AUTH_URL = "/api/auth";
const SEGMENT_PATTERN = /^[A-Za-z0-9_-]+$/;

const segment = (value: string | number): string => {
  const text = String(value);
  if (!SEGMENT_PATTERN.test(text)) throw new Error("Invalid API path segment");
  return text;
};

export const API_ROUTES = {
  task: `${API_URL}/task`,
  rerunTask: (id: string) => `${API_URL}/task/re-run/${segment(id)}`,
  tasks: `${API_URL}/tasks`,
  getTask: (pid: string) => `${API_URL}/task/${segment(pid)}`,
  queries: `${API_URL}/queries`,
  query: `${API_URL}/query`,
  deleteQueriesBulk: `${API_URL}/queries/delete/bulk`,
  rerunQuery: (id: string) => `${API_URL}/query/re-run/${segment(id)}`,
  parseQuery: `${API_URL}/parse-query`,
  collections: `${API_URL}/collections`,
  collection: (id: number | string) => `${API_URL}/collections/${segment(id)}`,
  collectionDetails: (pid: string) =>
    `${API_URL}/collections/${segment(pid)}/details`,
  transitionCollection: (id: number | string) =>
    `${API_URL}/collections/${segment(id)}/transition_to`,
  collectionConfigItem: (id: number | string) =>
    `${API_URL}/collection_config/${segment(id)}`,
  custodianNetwork: (
    custodianId: number | string,
    networkId: number | string,
  ) =>
    `${API_URL}/custodians/${segment(custodianId)}/networks/${segment(networkId)}`,
  userWorkgroups: (userId: number | string) =>
    `${API_URL}/users/${segment(userId)}/workgroup`,
  userWorkgroup: (userId: number | string, workgroupId: number | string) =>
    `${API_URL}/users/${segment(userId)}/workgroup/${segment(workgroupId)}`,
  collectionWorkgroups: (id: number | string) =>
    `${API_URL}/collections/${segment(id)}/workgroup`,
  collectionWorkgroup: (id: number | string, workgroupId: number | string) =>
    `${API_URL}/collections/${segment(id)}/workgroup/${segment(workgroupId)}`,
  updateQuery: (id: number) => `${API_URL}/query/${segment(id)}`,
  restoreCollection: (id: number | string) =>
    `${API_URL}/collections/${segment(id)}/restore`,
  custodians: `${API_URL}/custodians`,
  custodian: (id: number | string) => `${API_URL}/custodians/${segment(id)}`,
  networks: `${API_URL}/custodian_networks`,
  network: (id: number | string) =>
    `${API_URL}/custodian_networks/${segment(id)}`,
  getMe: `${API_URL}/user`,
  signIn: `${API_AUTH_URL}/login`,
  authMethods: `${API_AUTH_URL}/methods`,
  ssoExchange: `${API_AUTH_URL}/sso/exchange`,
  getQuery: (pid: string) => `${API_URL}/query/${segment(pid)}`,
  getCodes: (domain: string) => `${API_URL}/codes/${segment(domain)}`,
  getTaskStatus: (taskId: string) =>
    `${API_URL}/task/${segment(taskId)}/status`,
  cancelTask: (taskId: string) => `${API_URL}/task/${segment(taskId)}/cancel`,
  queryResults: (queryPid: string) =>
    `${API_URL}/query/${segment(queryPid)}/results`,
  collectionHosts: `${API_URL}/collection_hosts`,
  collectionHost: (id: number) => `${API_URL}/collection_hosts/${segment(id)}`,
  restoreCollectionHost: (id: number) =>
    `${API_URL}/collection_hosts/${segment(id)}/restore`,
  custodianCollectionHosts: (pid: string) =>
    `${API_URL}/custodians/${segment(pid)}/collection_hosts`,
  custodianCollections: (pid: string) =>
    `${API_URL}/custodians/${segment(pid)}/collections`,
  collectionHealth: (id: string) =>
    `${API_URL}/collections/${segment(id)}/health`,
  collectionTaskHistory: (id: string) =>
    `${API_URL}/collections/${segment(id)}/task-history`,
  adminCollections: `${API_URL}/admin/collections`,
  userCollections: `${API_URL}/user/collections`,
  collectionConfig: `${API_URL}/collection_config`,
  rerunDistributions: (pid: string) =>
    `${API_URL}/collection/${segment(pid)}/distributions/run-manually`,
  conceptSets: `${API_URL}/concept_sets`,
  getConceptSet: (id: number) => `${API_URL}/concept_sets/${segment(id)}`,
  clearConceptSet: (conceptSetId: number) =>
    `${API_URL}/concept_sets/${segment(conceptSetId)}/clear`,
  attachConcept: (conceptSetId: number, conceptId: number) =>
    `${API_URL}/concept_sets/${segment(conceptSetId)}/attach/${segment(conceptId)}`,
  detachConcept: (conceptSetId: number, conceptId: number) =>
    `${API_URL}/concept_sets/${segment(conceptSetId)}/detach/${segment(conceptId)}`,
  searchConcepts: `${API_URL}/omop/concepts/search`,
  regressionTests: `${API_URL}/regression-tests`,
  regressionTestsAdmin: `${API_URL}/admin/regression-tests`,
  regressionTest: (pid: string) =>
    `${API_URL}/regression-tests/${segment(pid)}`,
  runRegressionTest: (pid: string) =>
    `${API_URL}/regression-tests/${segment(pid)}/run`,
  runRegressionTestSingle: (pid: string, collectionPid: string) =>
    `${API_URL}/regression-tests/${segment(pid)}/run/${segment(collectionPid)}`,
  workgroups: `${API_URL}/workgroups`,
  authCallback: "http://localhost:8100/auth/callback",
  users: `${API_URL}/users`,
  user: (id: number) => `${API_URL}/users/${segment(id)}`,
  featureFlags: `${API_URL}/features`,
  feature: (name: string) => `${API_URL}/features/${segment(name)}`,
  termDirectory: `${API_URL}/term-directory`,
  clicks: `${API_URL}/clicks`,
  download: (entity: DownloadEntity, pid: string, format: DownloadFormat) =>
    `${API_URL}/${segment(entity)}/${segment(pid)}/download/${segment(format)}`,
};

export const GATEWAY_ROUTES = {
  api: {
    oauth2: "http://localhost:8000/oauth2/authorize",
  },
};
