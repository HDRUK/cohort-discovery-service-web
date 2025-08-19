import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Link from "next/link";
import { notFound } from "next/navigation";
import QueryListPage from "./components/QueryListPage";
import NewQueryPage from "./components/NewQueryPage";
import CollectionsPage from "./components/CollectionsPage";
import { routes } from "@/config/routes";
import CodesPage from "./components/CodesPage";

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

  return (
    <TabContext value={tabId}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ borderBottom: 0, borderColor: "divider", width: "100%" }}>
          <TabList
            indicatorColor="secondary"
            slotProps={{
              indicator: { sx: { top: 0 } },
            }}
          >
            {TABS.map((t) => (
              <Tab
                key={t.id}
                label={t.label}
                component={Link}
                href={t.href}
                value={t.id}
              />
            ))}
          </TabList>
        </Box>

        <TabPanel value="new-query">
          <NewQueryPage {...props} />
        </TabPanel>

        <TabPanel value="history">
          <QueryListPage {...props} />
        </TabPanel>

        <TabPanel value="collections">
          <CollectionsPage />
        </TabPanel>

        <TabPanel value="codes">
          <CodesPage {...props} />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default DashboardTabPage;
