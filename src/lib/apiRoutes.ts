const API_URL = "/api/v1";
const API_AUTH_URL = "/api/auth";

export const API_ROUTES = {
  task: `${API_URL}/task`,
  rerunTask: (id: string) => `${API_URL}/task/re-run/${id}`,
  tasks: `${API_URL}/tasks`,
  getTask: (pid: string) => `${API_URL}/task/${pid}`,
  queries: `${API_URL}/queries`,
  deleteQueriesBulk: `${API_URL}/queries/delete/bulk`,
  rerunQuery: (id: string) => `${API_URL}/query/re-run/${id}`,
  parseQuery: `${API_URL}/parse-query`,
  collections: `${API_URL}/collections`,
  collection: (id: number | string) => `${API_URL}/collections/${id}`,
  custodians: `${API_URL}/custodians`,
  custodian: (id: number | string) => `${API_URL}/custodians/${id}`,
  networks: `${API_URL}/custodian_networks`,
  network: (id: number | string) => `${API_URL}/custodian_networks/${id}`,
  getMe: `${API_URL}/user`,
  signIn: `${API_AUTH_URL}/login`,
  getQuery: (pid: string) => `${API_URL}/query/${pid}`,
  getCodes: (domain: string) => `${API_URL}/codes/${domain}`,
  getTaskStatus: (taskId: string) => `${API_URL}/task/${taskId}/status`,
  cancelTask: (taskId: string) => `${API_URL}/task/${taskId}/cancel`,
  queryResults: (queryPid: string) => `${API_URL}/query/${queryPid}/results`,
  collectionHosts: `${API_URL}/collection_hosts`,
  collectionHost: (id: number) => `${API_URL}/collection_hosts/${id}`,
  custodianCollectionHosts: (pid: string) =>
    `${API_URL}/custodians/${pid}/collection_hosts`,
  custodianCollections: (pid: string) =>
    `${API_URL}/custodians/${pid}/collections`,
  adminCollections: `${API_URL}/admin/collections`,
  userCollections: `${API_URL}/user/collections`,
  collectionConfig: `${API_URL}/collection_config`,
  rerunDistributions: (pid: string) =>
    `${API_URL}/collection/${pid}/distributions/run-manually`,
  conceptSets: `${API_URL}/concept_sets`,
  getConceptSet: (id: number) => `${API_URL}/concept_sets/${id}`,
  clearConceptSet: (conceptSetId: number) =>
    `${API_URL}/concept_sets/${conceptSetId}/clear`,
  attachConcept: (conceptSetId: number, conceptId: number) =>
    `${API_URL}/concept_sets/${conceptSetId}/attach/${conceptId}`,
  detachConcept: (conceptSetId: number, conceptId: number) =>
    `${API_URL}/concept_sets/${conceptSetId}/detach/${conceptId}`,
  searchConcepts: `${API_URL}/omop/concepts/search`,
  workgroups: `${API_URL}/workgroups`,
  authCallback: "http://localhost:8100/auth/callback",
  users: `${API_URL}/users`,
  user: (id: number) => `${API_URL}/users/${id}`,
  featureFlags: `${API_URL}/features`,
};

export const GATEWAY_ROUTES = {
  api: {
    oauth2: "http://localhost:8000/oauth2/authorize",
  },
};
