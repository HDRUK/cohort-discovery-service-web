const dashboardPath = (subpath: string = "", queryParams?: string) =>
  `/dashboard${subpath ? `/${subpath}` : ""}${
    queryParams ? `?${queryParams}` : ""
  }` as const;

const teamPath = (pid: string, subpath?: string) =>
  `/custodian-admin/${pid}${subpath ? `/${subpath}` : ""}`;

const adminPath = (subpath?: string) => `/admin${subpath ? `/${subpath}` : ""}`;

export const routes = {
  dashboard: dashboardPath(),
  dashboardNewQuery: (queryParams?: string) =>
    dashboardPath("new-query", queryParams),
  dashboardQueryResult: (pid: string, queryParams?: string) =>
    `${dashboardPath("query-result")}-${pid ? pid : ""}?query=${
      pid ? pid : ""
    }${queryParams ? `&${queryParams}` : ""}`,
  dashboardHistory: (queryParams?: string) =>
    `${dashboardPath("query-history")}?${queryParams}`,
  dashboardCollections: dashboardPath("collections"),
  dashboardCodes: dashboardPath("codes"),
  profile: "/profile",
  definitions: "/my-definitions",
  admin: adminPath(),
  adminUsers: adminPath("users"),
  adminWorkgroups: adminPath("workgroups"),
  adminCollections: adminPath("collections"),
  teamHome: teamPath,
  teamHosts: (pid: string) => teamPath(pid, "hosts"),
  teamCollections: (pid: string) => teamPath(pid, "collections"),
};
