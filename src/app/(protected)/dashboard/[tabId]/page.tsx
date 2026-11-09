import { Skeleton } from "@mui/material";
import { notFound } from "next/navigation";
import NewQueryPage from "./components/NewQueryPage";
import QueryResultsPage from "./components/QueryResultsPage";
import { routes } from "@/config/routes";
import TabsShell from "@/components/TabsShell";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import { getQuery } from "@/server/data/queries";
import { capVarChar } from "@/utils/string";
import { SearchParams } from "@/types/api";
import QueryHistoryPage from "./components/QueryHistoryPage";
import { QueriesTableSkeleton } from "@/modules/QueriesTable";
import { getQueryName } from "@/utils/query";

type Params = Promise<{ tabId: string }>;

export const instant = false;

const DashboardTabPage = async (props: {
  params: Params;
  searchParams: Promise<SearchParams>;
}) => {
  const { params, searchParams } = props;
  const { tabId } = await params;
  const { query, open_queries: openQueries } = await searchParams;
  const arrayOpenQueries = ((openQueries as string) ?? "").split(",");

  const resultsTabs = openQueries
    ? await Promise.all(
        arrayOpenQueries.map(async (queryPid) => {
          const { data: openQueryData } = await getQuery(queryPid);
          const resultTabId = `query-result-${queryPid}`;

          return {
            id: resultTabId,
            label: `Result: ${
              openQueryData
                ? capVarChar(getQueryName(openQueryData), 30, true)
                : queryPid
            }`,
            href: routes.dashboardQueryResult(queryPid, arrayOpenQueries ?? []),
            onCloseHref: routes.dashboardNewQuery(
              arrayOpenQueries.filter((val) => val !== queryPid) ?? [],
            ),
            page:
              tabId === resultTabId ? (
                <QueryResultsPage {...props} />
              ) : (
                <Skeleton height={600} />
              ),
          };
        }),
      )
    : [];

  const TABS = [
    {
      id: "new-query",
      label: "New Query",
      href: routes.dashboardNewQuery(arrayOpenQueries),
      page:
        tabId === "new-query" ? (
          <NewQueryPage
            query={query as string}
            open_queries={(openQueries ?? "").toString()}
          />
        ) : (
          <Skeleton height={600} />
        ),
    },
    {
      id: "query-history",
      label: "Query History",
      href: routes.dashboardHistory(arrayOpenQueries),
      page:
        tabId === "query-history" ? (
          <QueryHistoryPage {...props} />
        ) : (
          <QueriesTableSkeleton />
        ),
    },
  ].concat(resultsTabs);

  const isValidTabId = (tabId: string) => TABS.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return token && <TabsShell value={tabId} tabs={TABS} />;
};

export default DashboardTabPage;
