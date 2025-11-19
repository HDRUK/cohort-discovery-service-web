import { notFound } from "next/navigation";
import NewQueryPage from "./components/NewQueryPage";
import QueryResultsPage from "./components/QueryResultsPage";
import { routes } from "@/config/routes";
import TabsShell from "@/components/TabsShell";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";
import { Box } from "@mui/material";

type Params = Promise<{ tabId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const DashboardTabPage = async (props: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { params, searchParams } = props;
  const { tabId } = await params;
  const { query } = await searchParams;

  // note - work in progress
  // - to be completed and cleaned up in the next few tasks
  const TABS = [
    {
      id: "new-query",
      label: "New Query",
      href: routes.dashboardNewQuery(),
    },
    ...(query
      ? [
          {
            id: "query-result",
            label: "Query Result",
            href: routes.dashboardQueryResult(query as string),
          },
        ]
      : []),
    /*{ id: "history", label: "History", href: routes.dashboardHistory },
  {
    id: "collections",
    label: "Collections",
    href: routes.dashboardCollections,
  },
  {
    id: "codes",
    label: "Codes",
    href: routes.dashboardCodes,
  },*/
  ];

  const isValidTabId = (tabId: string) => TABS.some((t) => t.id === tabId);

  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return (
    token && (
      <TabsShell initial={tabId} tabs={TABS}>
        <NewQueryPage />
        <QueryResultsPage {...props} />
      </TabsShell>
    )
  );
};

export default DashboardTabPage;
