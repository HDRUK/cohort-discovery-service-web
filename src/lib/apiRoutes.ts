const API_URL = "/api/v1";

export const API_ROUTES = {
  task: `${API_URL}/task`,
  tasks: `${API_URL}/tasks`,
  queries: `${API_URL}/queries`,
  collections: `${API_URL}/collections`,
  getQuery: (pid: string) => `${API_URL}/query/${pid}`,
  getCodes: (domain: string) => `${API_URL}/codes/${domain}`,
  getTaskStatus: (taskId: string) => `${API_URL}/task/${taskId}/status`,
  cancelTask: (taskId: string) => `${API_URL}/task/${taskId}/cancel`,
  queryResults: (queryPid: string) => `${API_URL}/query/${queryPid}/results`,
};
