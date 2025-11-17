import { notFound } from "next/navigation";
import NewQueryPage from "./components/NewQueryPage";
import { routes } from "@/config/routes";
import TabsShell from "@/components/TabsShell";
import { GATEWAY_TOKEN_NAME } from "@/config/internals";
import { cookies } from "next/headers";

// to be reimplemented in new tickets per new design
const TABS = [
  { id: "new-query", label: "New Query", href: routes.dashboardNewQuery },
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

  const cookieStore = await cookies();
  const token = cookieStore.get(GATEWAY_TOKEN_NAME)?.value;

  if (!isValidTabId(tabId)) return notFound();

  return (
    token && (
      <TabsShell tabs={TABS}>
        <NewQueryPage />
      </TabsShell>
    )
  );
};

export default DashboardTabPage;
