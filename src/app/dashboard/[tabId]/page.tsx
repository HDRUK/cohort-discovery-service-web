import { Box, Paper, Typography, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Link from "next/link";
import { notFound } from "next/navigation";
import QueryBuilder from "../../components/QueryBuilder";
import SubmitQueryButton from "../../components/SubmitQueryButton";
import CohortQueryInput from "../../components/CohortQueryInput";
import QueryList from "../../components/QueryList";

const validTabs = {
  "new-query": "1",
  history: "2",
  collections: "3",
};

interface Props {
  params: {
    tabId: string;
  };
}

const DashboardTabPage = async ({ params }: Props) => {
  const { tabId } = await params;
  const tabValue = validTabs[tabId];

  if (!tabValue) return notFound();

  return (
    <TabContext value={tabValue}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}>
          <TabList aria-label="dashboard tabs" centered value={tabValue}>
            <Tab
              label="New Query"
              component={Link}
              href="/dashboard/new-query"
              value="1"
            />
            <Tab
              label="History"
              component={Link}
              href="/dashboard/history"
              value="2"
            />
            <Tab
              label="Collections"
              component={Link}
              href="/dashboard/collections"
              value="3"
            />
          </TabList>
        </Box>

        <TabPanel value="1">
          <CohortQueryInput />
          <Paper
            sx={{
              width: "50%",
              p: 2,
              borderStyle: "solid",
              borderColor: "primary.main",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <QueryBuilder />
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                width: "100%",
                my: 2,
              }}
            >
              <SubmitQueryButton />
            </Box>
          </Paper>
        </TabPanel>

        <TabPanel value="2">
          <Box sx={{ height: 400 }}>
            <QueryList />
          </Box>
        </TabPanel>

        <TabPanel value="3">
          <Typography variant="body1" color="text.secondary">
            Collections feature coming soon!
          </Typography>
        </TabPanel>
      </Box>
    </TabContext>
  );
};

export default DashboardTabPage;
