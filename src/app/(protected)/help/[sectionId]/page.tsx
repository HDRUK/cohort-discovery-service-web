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
  href: string;
};

export type VideoLibrarySection = {
  id: string;
  sectionTitle: string;
};

export function getVideoById(id: string) {
  const video = VIDEOS.find((v) => v.id === id);
  return video;
}

export const VIDEO_SECTIONS: VideoLibrarySection[] = [
  { id: "1", sectionTitle: "Query Building Tutorials" },
  { id: "2", sectionTitle: "Results Tutorials" },
];

// Note that we use "mqdefault.jpg" for each thumbnail in order to retrieve a 16:9 thumbnail that matches our video content.
// hqdefault.jpg by contrast is typically 4:3

export const VIDEOS: Video[] = [
  {
    id: "rename-query",
    title: "How do I rename my query?",
    sectionId: "1",
    url: "https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed",
    thumbnail: "https://img.youtube.com/vi/yvFrnbXlqRk/mqdefault.jpg",
    categorisation: "Beginner",
    href: routes.help(kebabCase("Query Building Tutorials"), "rename-query"),
  },
  {
    id: "reorder-rules",
    title: "How do I re-order rules?",
    sectionId: "1",
    text: "Click the box to the right of the query name, type your new name, and press Enter to save. To rename it again, hover over the name, double-click, edit, and press Enter.",
    url: "https://www.youtube.com/embed/RNVqqCpgeZk?feature=oembed",
    thumbnail: "https://img.youtube.com/vi/RNVqqCpgeZk/mqdefault.jpg",
    categorisation: "Advanced",
    href: routes.help(kebabCase("Query Building Tutorials"), "reorder-rules"),
    // href: function () {
    //       return routes.help(kebabCase("Query Building Tutorials"), this.id);
    // },
  },
  {
    id: "reorder-rules2",
    title: "How do I re-order rules?",
    sectionId: "2",
    text: "Click the box to the right of the query name, type your new name, and press Enter to save. To rename it again, hover over the name, double-click, edit, and press Enter.",
    url: "https://www.youtube.com/embed/RNVqqCpgeZk?feature=oembed",
    thumbnail: "https://img.youtube.com/vi/RNVqqCpgeZk/mqdefault.jpg",
    categorisation: "Beginner",
    href: routes.help(kebabCase("Results Tutorials"), "reorder-rules2"),
  },
  {
    id: "rename-query2",
    title: "How do I rename my query?",
    sectionId: "2",
    url: "https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed",
    thumbnail: "https://img.youtube.com/vi/yvFrnbXlqRk/mqdefault.jpg",
    categorisation: "Medium",
    href: routes.help(kebabCase("Results Tutorials"), "rename-query2"),
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
    <Paper sx={{ py: 2, px: 4, borderRadius: 0 }}>
      <Title
        title="General Guidance"
        useSeparator
        subTitle={currentTabName}
        sx={{ mb: 2 }}
      />
      <Paper sx={{ bgcolor: "white", py: 2, height: "100%" }}>
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
              height: "2px",
              paddingBottom: "2px",
            },
          })}
        />
      </Paper>
    </Paper>
  );
}
