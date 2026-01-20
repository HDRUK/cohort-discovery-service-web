import { notFound, redirect } from "next/navigation";
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
  const { query, open_queries } = await searchParams;

  let queryName: string | undefined;

  if (query && query !== "undefined") {
    const { data } = await getQuery(query as string);

    if (data) {
      queryName = capVarChar(getQueryName(data), 30, true);
    }
  }

  const results_tabs = open_queries
    ? (JSON.parse(open_queries || "[]") as string[]).map((tabId) => {
        return {
          id: `query-result-${tabId}`,
          label: `Result: ${tabId.slice(0, 8)}`,
          href: routes.dashboardQueryResult(
            tabId as string,
            `open_queries=${(open_queries ?? "").toString()}`
          ),
          onCloseHref: routes.dashboardNewQuery(
            `open_queries=${(open_queries ?? "").toString()}`
          ),
          handleClose: async () => {
            "use server";
            const new_open_queries = (
              JSON.parse(open_queries || "[]") as string[]
            ).filter((val) => val !== tabId);
            redirect(
              routes.dashboardNewQuery(
                `open_queries=${(new_open_queries ?? "").toString()}`
              )
            );
          },
          page: (
            <QueryResultsPage
              query={tabId}
              open_queries={open_queries}
              {...props}
            />
          ),
        };
      })
    : [];

  const TABS = [
    {
      id: "new-query",
      label: "New Query",
      href: routes.dashboardNewQuery(
        `open_queries=${(open_queries ?? "").toString()}`
      ),
      page: (
        <NewQueryPage
          query={query as string}
          open_queries={(open_queries ?? "").toString()}
        />
      ),
    },
    {
      id: "query-history",
      label: "Query History",
      href: routes.dashboardHistory(
        `open_queries=${(open_queries ?? "").toString()}`
      ),
      page: (
        <QueryHistoryPage query={""} open_queries={open_queries} {...props} />
      ),
    },
  ].concat(results_tabs);

  const isValidTabId = (tabId: string) => TABS.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return token && <TabsShell value={tabId} tabs={TABS} />;
};

export default DashboardTabPage;
