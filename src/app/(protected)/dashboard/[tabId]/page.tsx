import { notFound } from "next/navigation";
import NewQueryPage from "./components/NewQueryPage";
import QueryResultsPage from "./components/QueryResultsPage";
import { routes } from "@/config/routes";
import TabsShell from "@/components/TabsShell";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import getQuery from "@/actions/getQuery";
import { capVarChar } from "@/utils/string";
import { Query } from "@/types/api";
import { SearchParams } from "@/types/api";
import QueryHistoryPage from "./components/QueryHistoryPage";

type Params = Promise<{ tabId: string }>;

const DashboardTabPage = async (props: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { params, searchParams } = props;
  const { tabId } = await params;
  const { query } = await searchParams;

  let queryData: Query | undefined;
  let queryName: string | undefined;

  if (query) {
    const { data } = await getQuery(query as string);
    queryData = data;
    queryName = capVarChar(queryData.name, 30, true);
  }

  const showQueryResult = query && queryName;

  const TABS = [
    {
      id: "new-query",
      label: "New Query",
      href: routes.dashboardNewQuery(),
      page: <NewQueryPage query={query as string} />,
    },
    ...(showQueryResult
      ? [
          {
            id: "query-result",
            label: queryName || "Query Result",
            href: routes.dashboardQueryResult(query as string),
            onCloseHref: routes.dashboardNewQuery(),
            page: tabId === "query-result" && <QueryResultsPage {...props} />,
          },
        ]
      : []),
    {
      id: "query-history",
      label: "Query History",
      href: routes.dashboardHistory,
      page: tabId === "query-history" && <QueryHistoryPage {...props} />,
    },
  ];

  const isValidTabId = (tabId: string) => TABS.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return token && <TabsShell value={tabId} tabs={TABS} />;
};

export default DashboardTabPage;
