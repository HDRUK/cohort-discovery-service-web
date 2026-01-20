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
  const hasQuery = !!query;

  console.log(
    "DashboardTabPage open_queries",
    open_queries,
    typeof open_queries,
    JSON.parse(open_queries || "[]")
  );

  const results_tabs = open_queries
    ? (JSON.parse(open_queries || "[]") as string[]).map((tabId) => {
        // console.log(
        //   "tabId",
        //   tabId,
        //   routes.dashboardQueryResult(
        //     query as string,
        //     `open_queries=${(open_queries ?? "").toString()}`
        //   )
        // );
        return {
          id: `query-result-${tabId}`,
          // disabled: false,
          label: `Result: ${tabId}`,
          href: routes.dashboardQueryResult(
            tabId as string,
            `open_queries=${(open_queries ?? "").toString()}`
          ),
          onCloseHref: routes.dashboardNewQuery(
            `open_queries=${(open_queries ?? "").toString()}`
          ),
          handleClose: async () => {
            "use server";
            console.log(
              "handleClose called for tabId",
              tabId,
              "open_queries is currently",
              open_queries,
              typeof open_queries
            );
            const new_open_queries = (
              JSON.parse(open_queries || "[]") as string[]
            ).pop();
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

  console.log("results_tabs", results_tabs);
  console.log(`open_queries=${(open_queries ?? "").toString()}`);
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
    // {
    //   id: "query-result",
    //   // disabled: !hasQuery,
    //   label: queryName ?? "Query Result",
    //   href: routes.dashboardQueryResult(
    //     "f4e00209-66a1-4e8b-b945-5ea4a3461262" as string,
    //     `open_queries=${(open_queries ?? "").toString()}`
    //   ),
    //   // onCloseHref: routes.dashboardNewQuery((open_queries ?? "").toString()),
    //   page: <QueryResultsPage {...props} />,
    // },
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
  console.log("TABS", TABS);
  const isValidTabId = (tabId: string) => TABS.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return token && <TabsShell value={tabId} tabs={TABS} />;
};

export default DashboardTabPage;
