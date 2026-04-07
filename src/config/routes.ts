const dashboardPath = (subpath: string = "", queryParams?: string) =>
  `/dashboard${subpath ? `/${subpath}` : ""}${
    queryParams ? `?${queryParams}` : ""
  }` as const;

const teamPath = (pid: string, subpath?: string) =>
  `/custodian-admin/${pid}${subpath ? `/${subpath}` : ""}`;

const adminPath = (subpath?: string) => `/admin${subpath ? `/${subpath}` : ""}`;

const helpPath = (sectionId?: string, tutorialId?: string) =>
  `/help${sectionId ? `/${sectionId}${tutorialId ? `/${tutorialId}` : ""}` : ""}`;

export const routes = {
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
};
