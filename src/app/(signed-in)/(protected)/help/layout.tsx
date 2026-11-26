"use client";

import { ReactNode } from "react";
import { Box, Paper } from "@mui/material";
import { usePathname } from "next/navigation";
import { routes } from "@/config/routes";
import TabsShell from "@/components/TabsShell";
import Title from "@/components/Title";

// The tutorial tabs, in display order. Each `slug` is a real route folder under
// this directory (help/<slug>/page.tsx) — add a folder and a line here to add a
// tab.
const HELP_TABS = [
  { slug: "overview", label: "Overview Tutorials" },
  { slug: "query-building-tutorials", label: "Query Building Tutorials" },
  { slug: "results-tutorials", label: "Results Tutorials" },
  { slug: "history-tutorials", label: "History Tutorials" },
  { slug: "collection-admin-tutorials", label: "Collection Admin Tutorials" },
];

const HelpLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const currentTab =
    HELP_TABS.find((tab) => pathname.startsWith(routes.help(tab.slug))) ??
    HELP_TABS[0];

  return (
    <Paper sx={{ py: 2, px: 4, borderRadius: 0, height: "100%" }}>
      <Title
        title="General Guidance"
        useSeparator
        subTitle={currentTab.label}
        sx={{ mb: 2 }}
      />
      <Paper
        sx={{
          bgcolor: "white",
          py: 2,
          height: "calc(100% - 50px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TabsShell
          tabs={HELP_TABS.map((tab) => ({
            id: tab.slug,
            label: tab.label,
            href: routes.help(tab.slug),
            page: null,
          }))}
          value={currentTab.slug}
          forceValue
          sx={{
            backgroundColor: "white",
            height: "auto",
            flex: "0 0 auto",
            overflow: "visible",
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
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            px: 2,
            py: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Paper>
    </Paper>
  );
};

export default HelpLayout;
