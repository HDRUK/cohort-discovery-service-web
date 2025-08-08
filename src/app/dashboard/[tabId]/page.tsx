import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Link from "next/link";
import { notFound } from "next/navigation";
import QueryListPage from "./components/QueryListPage";
import NewQueryPage from "./components/NewQueryPage";
import CollectionsPage from "./components/CollectionsPage";

enum TabId {
  NewQuery = "new-query",
  History = "history",
  Collections = "collections",
}

const isValidTabId = (tabId: string): tabId is TabId => {
  return Object.values(TabId).includes(tabId as TabId);
};

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
              indicator: {
                sx: {
                  top: 0,
                },
              },
            }}
          >
            <Tab
              label="New Query"
              component={Link}
              href={`/dashboard/${TabId.NewQuery}`}
              value={TabId.NewQuery}
            />
            <Tab
              label="History"
              component={Link}
              href={`/dashboard/${TabId.History}`}
              value={TabId.History}
            />
            <Tab
              label="Collections"
              component={Link}
              href={`/dashboard/${TabId.Collections}`}
              value={TabId.Collections}
            />
          </TabList>
        </Box>

        <TabPanel value={TabId.NewQuery}>
          <NewQueryPage {...props} />
        </TabPanel>

        <TabPanel value={TabId.History}>
          <QueryListPage {...props} />
        </TabPanel>

        <TabPanel value={TabId.Collections}>
          <CollectionsPage />
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default DashboardTabPage;
