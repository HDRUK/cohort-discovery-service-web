const dashboardPath = (subpath: string = "", queryParams?: string) =>
  `/dashboard${subpath ? `/${subpath}` : ""}${
    queryParams ? `?${queryParams}` : ""
  }` as const;

const teamPath = (pid: string, subpath?: string) =>
  `/custodian-admin/${pid}${subpath ? `/${subpath}` : ""}`;

const adminPath = (subpath?: string) => `/admin${subpath ? `/${subpath}` : ""}`;

const withQuery = (path: string, params?: URLSearchParams) => {
  const query = params?.toString();
  return query ? `${path}?${query}` : path;
};

const helpPath = (sectionId?: string, tutorialId?: string) =>
  `/help${sectionId ? `/${sectionId}${tutorialId ? `/${tutorialId}` : ""}` : ""}`;

export const routes = {
  home: "/",
  login: "/login",
  loginWithReturn: (returnTo: string) =>
    `/login?return_to=${encodeURIComponent(returnTo)}`,
  logout: "/api/auth/logout",
  ssoCallback: "/api/auth/sso/callback",
  api: {
    collectionHostCredentials: (hostId: number) =>
      `/api/collection-hosts/${hostId}`,
    collectionDetails: (pid: string) => `/api/collections/${pid}/details`,
    collectionHealth: (pid: string, params: URLSearchParams) =>
      withQuery(`/api/collections/${pid}/health`, params),
    collectionTaskHistory: (pid: string, params: URLSearchParams) =>
      withQuery(`/api/collections/${pid}/task-history`, params),
    adminCollectionHealth: (pid?: string) =>
      withQuery(
        "/api/admin/collection-health",
        pid ? new URLSearchParams({ pid }) : undefined,
      ),
    queries: (params: URLSearchParams) => withQuery("/api/queries", params),
    query: (pid: string, params?: URLSearchParams) =>
      withQuery(`/api/queries/${pid}`, params),
    task: (pid: string) => `/api/tasks/${pid}`,
    regressionTests: "/api/regression-tests",
    termDirectory: (params: URLSearchParams) =>
      withQuery("/api/term-directory", params),
    conceptSearch: "/api/concepts/search",
    parseQuery: "/api/parse-query",
  },
  ssoError: (error: string) =>
    `/auth/sso/error?error=${encodeURIComponent(error)}`,
  dashboard: dashboardPath(),
  dashboardNewQuery: (openQueries?: string[], queryParams?: string) =>
    dashboardPath(
      "new-query",
      `${openQueries ? `open_queries=${openQueries.join(",")}` : ""}${
        queryParams ? `&${queryParams}` : ""
      }`,
    ),
  dashboardQueryResult: (
    pid: string,
    openQueries?: string[],
    queryParams?: string,
  ) =>
    `${dashboardPath("query-result")}-${pid ? pid : ""}?query=${
      pid ? pid : ""
    }${openQueries ? `&open_queries=${openQueries.join(",")}` : ""}${
      queryParams ? `&${queryParams}` : ""
    }`,
  dashboardHistory: (openQueries?: string[], queryParams?: string) =>
    `${dashboardPath("query-history")}?${
      openQueries ? `open_queries=${openQueries.join(",")}` : ""
    }${queryParams ? `&${queryParams}` : ""}`,
  dashboardCollections: dashboardPath("collections"),
  dashboardCodes: dashboardPath("codes"),
  profile: "/profile",
  definitions: "/my-definitions",
  help: (sectionId?: string, tutorialId?: string) =>
    helpPath(sectionId || "", sectionId ? tutorialId || "" : ""),
  admin: adminPath(),
  adminUsers: adminPath("users"),
  adminWorkgroups: adminPath("workgroups"),
  adminCollections: adminPath("collections"),
  adminNetworks: adminPath("networks"),
  teamHome: teamPath,
  teamHosts: (pid: string) => teamPath(pid, "hosts"),
  teamCollections: (pid: string) => teamPath(pid, "collections"),
  config: adminPath("configuration"),
  adminRegression: adminPath("regression"),
  adminCollectionHealth: adminPath("collection-health"),
  adminCollectionHealthDetail: (pid: string) =>
    adminPath(`collection-health/${pid}`),
  termDirectory: "/term-directory",
  termsAndConditions: "/terms-and-conditions",
  privacyPolicy: "/about/privacy-policy",
};
