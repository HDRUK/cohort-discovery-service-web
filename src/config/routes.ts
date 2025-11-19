const dashboardPath = (subpath: string = "", queryParams?: string) =>
  `/dashboard${subpath ? `/${subpath}` : ""}${
    queryParams ? `?${queryParams}` : ""
  }` as const;

export const routes = {
  dashboard: dashboardPath(),
  dashboardNewQuery: (queryParams?: string) =>
    dashboardPath("new-query", queryParams),
  dashboardQueryResult: (pid: string) =>
    `${dashboardPath("query-result")}?query=${pid}`,
  dashboardHistory: dashboardPath("history"),
  dashboardCollections: dashboardPath("collections"),
  dashboardCodes: dashboardPath("codes"),
  profile: "/profile",
  definitions: "/my-definitions",
  admin: "/admin",
  team: (pid: string) => `/custodian-admin/${pid}`,
};
