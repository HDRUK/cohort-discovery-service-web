import { notFound } from "next/navigation";
import NewQueryPage from "./components/NewQueryPage";
import QueryResultsPage from "./components/QueryResultsPage";
import { routes } from "@/config/routes";
import TabsShell from "@/components/TabsShell";
import { ACCESS_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import getQuery from "@/actions/getQuery";
import { capVarChar } from "@/utils/string";
import { SearchParams } from "@/types/api";
import QueryHistoryPage from "./components/QueryHistoryPage";
import { getQueryName } from "@/utils/query";

type Params = Promise<{ tabId: string }>;

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
        arrayOpenQueries.map(async (tabId) => {
          const { data: openQueryData } = await getQuery(tabId as string);

          return {
            id: `query-result-${tabId}`,
            label: `Result: ${
              openQueryData
                ? capVarChar(getQueryName(openQueryData), 30, true)
                : tabId
            }`,
            href: routes.dashboardQueryResult(
              tabId as string,
              arrayOpenQueries ?? [],
            ),
            onCloseHref: routes.dashboardNewQuery(
              arrayOpenQueries.filter((val) => val !== tabId) ?? [],
            ),
            page: <QueryResultsPage {...props} />,
          };
        }),
      )
    : [];

  const TABS = [
    {
      id: "new-query",
      label: "New Query",
      href: routes.dashboardNewQuery(arrayOpenQueries),
      page: (
        <NewQueryPage
          query={query as string}
          open_queries={(openQueries ?? "").toString()}
        />
      ),
    },
    {
      id: "query-history",
      label: "Query History",
      href: routes.dashboardHistory(arrayOpenQueries),
      page: <QueryHistoryPage {...props} />,
    },
  ].concat(resultsTabs);

  const isValidTabId = (tabId: string) => TABS.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return token && <TabsShell value={tabId} tabs={TABS} />;
};

export default DashboardTabPage;
