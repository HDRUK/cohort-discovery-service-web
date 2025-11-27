const dashboardPath = (subpath: string = "", queryParams?: string) =>
  `/dashboard${subpath ? `/${subpath}` : ""}${
    queryParams ? `?${queryParams}` : ""
  }` as const;

const teamPath = (pid: string, subpath: string) =>
  `/custodian-admin/${pid}/${subpath}`;

export const routes = {
  dashboard: dashboardPath(),
  dashboardNewQuery: (queryParams?: string) =>
    dashboardPath("new-query", queryParams),
  dashboardQueryResult: (pid: string) =>
    `${dashboardPath("query-result")}?query=${pid}`,
  dashboardHistory: dashboardPath("query-history"),
  dashboardCollections: dashboardPath("collections"),
  dashboardCodes: dashboardPath("codes"),
  profile: "/profile",
  definitions: "/my-definitions",
  admin: "/admin",
  teamHosts: (pid: string) => teamPath(pid, "hosts"),
  teamCollections: (pid: string) => teamPath(pid, "collections"),
};
