import { DownloadEntity, DownloadFormat } from "@/utils/download";

const API_URL = "/api/v1";
const API_AUTH_URL = "/api/auth";

export const API_ROUTES = {
  task: `${API_URL}/task`,
  rerunTask: (id: string) => `${API_URL}/task/re-run/${encodeURIComponent(id)}`,
  tasks: `${API_URL}/tasks`,
  getTask: (pid: string) => `${API_URL}/task/${encodeURIComponent(pid)}`,
  queries: `${API_URL}/queries`,
  query: `${API_URL}/query`,
  deleteQueriesBulk: `${API_URL}/queries/delete/bulk`,
  rerunQuery: (id: string) =>
    `${API_URL}/query/re-run/${encodeURIComponent(id)}`,
  parseQuery: `${API_URL}/parse-query`,
  collections: `${API_URL}/collections`,
  collection: (id: number | string) =>
    `${API_URL}/collections/${encodeURIComponent(id)}`,
  collectionDetails: (pid: string) =>
    `${API_URL}/collections/${encodeURIComponent(pid)}/details`,
  transitionCollection: (id: number | string) =>
    `${API_URL}/collections/${encodeURIComponent(id)}/transition_to`,
  collectionConfigItem: (id: number | string) =>
    `${API_URL}/collection_config/${encodeURIComponent(id)}`,
  custodianNetwork: (
    custodianId: number | string,
    networkId: number | string,
  ) =>
    `${API_URL}/custodians/${encodeURIComponent(custodianId)}/networks/${encodeURIComponent(networkId)}`,
  userWorkgroups: (userId: number | string) =>
    `${API_URL}/users/${encodeURIComponent(userId)}/workgroup`,
  userWorkgroup: (userId: number | string, workgroupId: number | string) =>
    `${API_URL}/users/${encodeURIComponent(userId)}/workgroup/${encodeURIComponent(workgroupId)}`,
  collectionWorkgroups: (id: number | string) =>
    `${API_URL}/collections/${encodeURIComponent(id)}/workgroup`,
  collectionWorkgroup: (id: number | string, workgroupId: number | string) =>
    `${API_URL}/collections/${encodeURIComponent(id)}/workgroup/${encodeURIComponent(workgroupId)}`,
  updateQuery: (id: number) => `${API_URL}/query/${encodeURIComponent(id)}`,
  restoreCollection: (id: number | string) =>
    `${API_URL}/collections/${encodeURIComponent(id)}/restore`,
  custodians: `${API_URL}/custodians`,
  custodian: (id: number | string) =>
    `${API_URL}/custodians/${encodeURIComponent(id)}`,
  networks: `${API_URL}/custodian_networks`,
  network: (id: number | string) =>
    `${API_URL}/custodian_networks/${encodeURIComponent(id)}`,
  getMe: `${API_URL}/user`,
  signIn: `${API_AUTH_URL}/login`,
  authMethods: `${API_AUTH_URL}/methods`,
  ssoExchange: `${API_AUTH_URL}/sso/exchange`,
  getQuery: (pid: string) => `${API_URL}/query/${encodeURIComponent(pid)}`,
  getCodes: (domain: string) =>
    `${API_URL}/codes/${encodeURIComponent(domain)}`,
  getTaskStatus: (taskId: string) =>
    `${API_URL}/task/${encodeURIComponent(taskId)}/status`,
  cancelTask: (taskId: string) =>
    `${API_URL}/task/${encodeURIComponent(taskId)}/cancel`,
  queryResults: (queryPid: string) =>
    `${API_URL}/query/${encodeURIComponent(queryPid)}/results`,
  collectionHosts: `${API_URL}/collection_hosts`,
  collectionHost: (id: number) =>
    `${API_URL}/collection_hosts/${encodeURIComponent(id)}`,
  restoreCollectionHost: (id: number) =>
    `${API_URL}/collection_hosts/${encodeURIComponent(id)}/restore`,
  custodianCollectionHosts: (pid: string) =>
    `${API_URL}/custodians/${encodeURIComponent(pid)}/collection_hosts`,
  custodianCollections: (pid: string) =>
    `${API_URL}/custodians/${encodeURIComponent(pid)}/collections`,
  collectionHealth: (id: string) =>
    `${API_URL}/collections/${encodeURIComponent(id)}/health`,
  collectionTaskHistory: (id: string) =>
    `${API_URL}/collections/${encodeURIComponent(id)}/task-history`,
  adminCollections: `${API_URL}/admin/collections`,
  userCollections: `${API_URL}/user/collections`,
  collectionConfig: `${API_URL}/collection_config`,
  rerunDistributions: (pid: string) =>
    `${API_URL}/collection/${encodeURIComponent(pid)}/distributions/run-manually`,
  conceptSets: `${API_URL}/concept_sets`,
  getConceptSet: (id: number) =>
    `${API_URL}/concept_sets/${encodeURIComponent(id)}`,
  clearConceptSet: (conceptSetId: number) =>
    `${API_URL}/concept_sets/${encodeURIComponent(conceptSetId)}/clear`,
  attachConcept: (conceptSetId: number, conceptId: number) =>
    `${API_URL}/concept_sets/${encodeURIComponent(conceptSetId)}/attach/${encodeURIComponent(conceptId)}`,
  detachConcept: (conceptSetId: number, conceptId: number) =>
    `${API_URL}/concept_sets/${encodeURIComponent(conceptSetId)}/detach/${encodeURIComponent(conceptId)}`,
  searchConcepts: `${API_URL}/omop/concepts/search`,
  regressionTests: `${API_URL}/regression-tests`,
  regressionTestsAdmin: `${API_URL}/admin/regression-tests`,
  regressionTest: (pid: string) =>
    `${API_URL}/regression-tests/${encodeURIComponent(pid)}`,
  runRegressionTest: (pid: string) =>
    `${API_URL}/regression-tests/${encodeURIComponent(pid)}/run`,
  runRegressionTestSingle: (pid: string, collectionPid: string) =>
    `${API_URL}/regression-tests/${encodeURIComponent(pid)}/run/${encodeURIComponent(collectionPid)}`,
  workgroups: `${API_URL}/workgroups`,
  authCallback: "http://localhost:8100/auth/callback",
  users: `${API_URL}/users`,
  user: (id: number) => `${API_URL}/users/${encodeURIComponent(id)}`,
  featureFlags: `${API_URL}/features`,
  feature: (name: string) => `${API_URL}/features/${encodeURIComponent(name)}`,
  termDirectory: `${API_URL}/term-directory`,
  clicks: `${API_URL}/clicks`,
  download: (entity: DownloadEntity, pid: string, format: DownloadFormat) =>
    `${API_URL}/${entity}/${encodeURIComponent(pid)}/download/${format}`,
};

export const GATEWAY_ROUTES = {
  api: {
    oauth2: "http://localhost:8000/oauth2/authorize",
  },
};
