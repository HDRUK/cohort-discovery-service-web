"use client";

import { useMemo } from "react";
import { Paper } from "@mui/material";
import { usePathname } from "next/navigation";
import { kebabCase } from "lodash";
import { routes } from "@/config/routes";
import TabsShell from "@/components/TabsShell";
import { TabType } from "@/components/TabsShell/TabsShell";
import OverviewTab from "../components/OverviewTab";
import Title from "@/components/Title";
import TutorialTab from "../components/TutorialTab";

export type Video = {
  id: string;
  title: string;
  text?: string;
  sectionId?: string;
  url: string;
  thumbnail?: string;
  categorisation: string;
};

export type VideoLibrarySection = {
  id: string;
  sectionTitle: string;
};

export const VIDEO_SECTIONS: VideoLibrarySection[] = [
  { id: "1", sectionTitle: "Query Building Tutorials" },
  { id: "2", sectionTitle: "Results Tutorials" },
  { id: "3", sectionTitle: "History Tutorials" },
  { id: "4", sectionTitle: "Data Onboarding Tutorials" },
];

// Note that we use "mqdefault.jpg" for each thumbnail in order to retrieve a 16:9 thumbnail that matches our video content.
// hqdefault.jpg by contrast is typically 4:3

export const VIDEOS: Video[] = [
  {
    id: "simple-query",
    title: "How do I build a simple query?",
    sectionId: "1",
    text: "Go to the New Query tab to create a new query. Enter a query name, then describe your cohort in the natural language search bar (for example, “adults with asthma”). Select the correct concept if prompted. The Query Tree and Hierarchy panel show the structure of your query. Review it in the Preview. Select Run Query to view anonymised cohort counts.",
    url: "https://www.youtube.com/embed/tqqSNy5VOFY?list=PLBI5k9SgYrIvz_h0hq83yFnTM4t9P569b&index=4&feature=oembed",
    thumbnail: "https://img.youtube.com/vi/tqqSNy5VOFY/mqdefault.jpg",
    categorisation: "Beginner",
  },
  {
    id: "advanced-query",
    title: "How do I build an advanced query?",
    sectionId: "1",
    text: "To build an advanced query, start with a natural language search or use the Insert panel to add a rule to a new or existing query. This allows you to build and expand your query step by step. Select a rule to apply a filter such as timeframe or age (only one can be applied per rule). You can also apply a global age filter across the entire query. Use AND and OR to combine rules. The Query Tree and Hierarchy panel show the structure of your query. Review it in the Preview. Select Run Query to view anonymised cohort counts.",
    url: "https://www.youtube.com/embed/oM3j3me6XvE?list=PLBI5k9SgYrIvz_h0hq83yFnTM4t9P569b&index=4&feature=oembed",
    thumbnail: "https://img.youtube.com/vi/oM3j3me6XvE/mqdefault.jpg",
    categorisation: "Advanced",
  },
  {
    id: "results",
    title: "How do I interpret my results?",
    sectionId: "2",
    text: "After running a query, results appear by collection with anonymised cohort counts and a status showing progress from pending to complete on the HDR UK Gateway. Select a collection name to open the linked page for that collection on the Gateway. Results show rounded cohort counts, not exact patient numbers. Low count suppression is applied to protect identification, so ‘0’ may mean no results or a suppressed low value. Suppression thresholds are set by each collection, typically for counts below 10. From the Results tab, you can edit or download your query.",
    url: "https://www.youtube.com/embed/jNN28Oh-v0s?list=PLBI5k9SgYrIvz_h0hq83yFnTM4t9P569b&index=4&feature=oembed",
    thumbnail: "https://img.youtube.com/vi/jNN28Oh-v0s/mqdefault.jpg",
    categorisation: "Beginner",
  },
  {
    id: "history",
    title: "How do I interpret my results?",
    sectionId: "3",
    text: "Use the Query History tab to view all previous queries on the HDR UK Gateway, including their status and results. Expand a query to see the full breakdown by collection. You can re-run, edit, download, or delete a query. Use this to revisit, compare, and refine your work over time.",
    url: "https://www.youtube.com/embed/jNN28Oh-v0s?list=PLBI5k9SgYrIvz_h0hq83yFnTM4t9P569b&index=4&feature=oembed",
    thumbnail: "https://img.youtube.com/vi/jNN28Oh-v0s/mqdefault.jpg",
    categorisation: "Beginner",
  },
  {
    id: "data-onboarding",
    title: "How do I onboard a collection?",
    sectionId: "4",
    text: "Go to the Management tab (labelled with your team name) in Cohort Discovery. Under Hosts, create a new Host to generate a Client ID and Client Secret. Then go to Collections and create a new collection, linking it to the Host. Configure your Bunny / BC|Insight environment using the provided credentials and collection details. Documentation: https://hutch.health/bunny/config . Your collection will appear in draft mode. Use the collection filter to run test queries against it before making it live. Draft collections are only visible to your team and HDR UK administrators, providing a ring-fenced testing environment. When ready, select Request to make active to submit your collection for review. Once approved, it will be activated and made available in Cohort Discovery.",
    url: "https://www.youtube.com/embed/EGBr0SGfnD8?list=PLBI5k9SgYrIvz_h0hq83yFnTM4t9P569b&index=1&feature=oembed",
    thumbnail: "https://img.youtube.com/vi/EGBr0SGfnD8/mqdefault.jpg",
    categorisation: "Advanced",
  },
];

export default function Help() {
  const pathname = usePathname();
  const tabs = useMemo<TabType[]>(() => {
    const tabs = [
      {
        label: "Overview Tutorials",
        page: <OverviewTab />,
        href: routes.help("overview"),
      },
      ...VIDEO_SECTIONS.map((section) => {
        return {
          id: kebabCase(section.sectionTitle),
          label: section.sectionTitle,
          page: (
            <TutorialTab
              videos={VIDEOS.filter((v) => v.sectionId === section.id)}
            />
          ),
          href: routes.help(kebabCase(section.sectionTitle)),
        };
      }),
    ];

    return tabs;
  }, []);

  const currentTabValue =
    tabs.find((tab) => {
      const matchPath = tab?.route ?? tab.href;
      if (!matchPath) return false;

      return pathname === matchPath || pathname.startsWith(matchPath + "/");
    })?.id ??
    tabs[0]?.id ??
    0;

  const currentTabName =
    tabs.find((tab) => {
      const matchPath = tab?.route ?? tab.href;
      if (!matchPath) return "Overview Tutorials";

      return pathname === matchPath || pathname.startsWith(matchPath + "/");
    })?.label ??
    tabs[0]?.label ??
    "Overview Tutorials";

  return (
    <Paper sx={{ py: 2, px: 4, borderRadius: 0, height: "100%" }}>
      <Title
        title="General Guidance"
        useSeparator
        subTitle={currentTabName}
        sx={{ mb: 2 }}
      />
      <Paper sx={{ bgcolor: "white", py: 2, height: "calc(100% - 50px)" }}>
        <TabsShell
          tabs={tabs}
          value={currentTabValue}
          sx={{
            backgroundColor: "white",
          }}
          tabListSx={(theme) => ({
            px: 2,
            "& .Mui-selected": {
              bgcolor: "white !important",
            },
            "& .MuiTabs-indicator": {
              top: 40,
              bottom: 0,
              bgcolor: theme.palette.secondary.main,
              opacity: 1,
              borderRadius: 0,
              height: 0.042,
              paddingBottom: 0.042,
            },
          })}
        />
      </Paper>
    </Paper>
  );
}
