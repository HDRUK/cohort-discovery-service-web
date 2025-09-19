const dashboardPath = (subpath: string = "") =>
  `/dashboard${subpath ? `/${subpath}` : ""}` as const;

export const routes = {
  dashboard: dashboardPath(),
  dashboardNewQuery: dashboardPath("new-query"),
  dashboardNewQueryWithPid: (pid: string) => ({
    pathname: dashboardPath("new-query"),
    query: { query: pid },
  }),
  dashboardHistory: dashboardPath("history"),
  dashboardCollections: dashboardPath("collections"),
  dashboardCodes: dashboardPath("codes"),
  profile: "/profile",
  definitions: "/my-definitions",
  admin: "/admin",
  team: (pid: string) => `/custodian-admin/${pid}`,
};
