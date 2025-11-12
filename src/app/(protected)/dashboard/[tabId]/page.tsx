import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Link from "next/link";
import { notFound } from "next/navigation";
import QueryListPage from "./components/QueryListPage";
import NewQueryPage from "./components/NewQueryPage";
import CollectionsPage from "./components/CollectionsPage";
import { routes } from "@/config/routes";
import CodesPage from "./components/CodesPage";
import { cookies } from "next/headers";
import TabsShell from "@/components/TabsShell";

const TABS = [
  { id: "new-query", label: "New Query", href: routes.dashboardNewQuery },
  { id: "history", label: "History", href: routes.dashboardHistory },
  {
    id: "collections",
    label: "Collections",
    href: routes.dashboardCollections,
  },
  {
    id: "codes",
    label: "Codes",
    href: routes.dashboardCodes,
  },
] as const;

type TabId = (typeof TABS)[number]["id"];

const isValidTabId = (tabId: string): tabId is TabId =>
  TABS.some((t) => t.id === tabId);

type Params = Promise<{ tabId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const DashboardTabPage = async (props: {
  params: Params;
  searchParams: SearchParams;
}) => {
  const { params } = props;
  const { tabId } = await params;

  if (!isValidTabId(tabId)) return notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <TabsShell
      tabs={[
        { id: "new-query", label: "New Query", href: routes.dashboardNewQuery },
      ]}
    >
      <NewQueryPage {...props} />
    </TabsShell>
  );
};

export default DashboardTabPage;
