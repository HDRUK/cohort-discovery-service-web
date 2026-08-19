"use client";

import { useMemo } from "react";
import { Paper } from "@mui/material";
import { usePathname } from "next/navigation";
import { HELP_SECTIONS, HELP_VIDEOS } from "@/content/help";
import { routes } from "@/config/routes";
import TabsShell from "@/components/TabsShell";
import { TabType } from "@/components/TabsShell/TabsShell";
import OverviewTab from "../components/OverviewTab";
import Title from "@/components/Title";
import TutorialTab from "../components/TutorialTab";

export default function Help() {
  const pathname = usePathname();
  const tabs = useMemo<TabType[]>(() => {
    const tabs = [
      {
        label: "Overview Tutorials",
        page: <OverviewTab />,
        href: routes.help("overview"),
      },
      ...HELP_SECTIONS.map((section) => {
        return {
          id: section.id,
          label: section.title,
          page: (
            <TutorialTab
              videos={HELP_VIDEOS.filter((v) => v.section === section.id)}
            />
          ),
          href: routes.help(section.id),
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
