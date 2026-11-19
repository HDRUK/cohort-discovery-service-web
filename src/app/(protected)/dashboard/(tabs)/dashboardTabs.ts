import { TabType } from "@/components/TabsShell";
import { routes } from "@/config/routes";
import { Query } from "@/types/api";
import { getQueryName } from "@/utils/query";
import { capVarChar } from "@/utils/string";

const RESULT_TAB_PREFIX = "query-result-";
const RESULT_LABEL_MAX_LENGTH = 30;

export type DashboardTab = Omit<TabType, "page">;

export const parseOpenQueries = (value: string | null | undefined): string[] =>
  (value ?? "").split(",").filter(Boolean);

export const resultTabId = (pid: string): string =>
  `${RESULT_TAB_PREFIX}${pid}`;

export const resultPidFrom = (tabId: string): string | null =>
  tabId.startsWith(RESULT_TAB_PREFIX)
    ? tabId.slice(RESULT_TAB_PREFIX.length) || null
    : null;

export const resultTabLabel = (query: Query | undefined, pid: string): string =>
  `Result: ${
    query ? capVarChar(getQueryName(query), RESULT_LABEL_MAX_LENGTH, true) : pid
  }`;

export const buildDashboardTabs = (
  openQueries: string[],
  labelFor: (pid: string) => string,
): DashboardTab[] => [
  {
    id: "new-query",
    label: "New Query",
    href: routes.dashboardNewQuery(openQueries),
  },
  {
    id: "query-history",
    label: "Query History",
    href: routes.dashboardHistory(openQueries),
  },
  ...openQueries.map((pid) => ({
    id: resultTabId(pid),
    label: labelFor(pid),
    href: routes.dashboardQueryResult(pid, openQueries),
    onCloseHref: routes.dashboardNewQuery(
      openQueries.filter((openPid) => openPid !== pid),
    ),
  })),
];
