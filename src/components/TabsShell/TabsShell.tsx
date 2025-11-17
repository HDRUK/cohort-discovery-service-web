"use client";

import * as React from "react";
import { Box, BoxProps, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Link from "next/link";

type TabType = {
  id?: string;
  label: string;
  href?: string;
};

type TabsShellProps = {
  tabs: TabType[];
  children: React.ReactNode | React.ReactNode[];
  initial?: number;
  sx?: BoxProps["sx"];
  tabHeaderSx?: BoxProps["sx"];
  tabContentSx?: BoxProps["sx"];
};

export default function TabsShell({
  tabs,
  children,
  initial = 0,
  sx = {
    display: "flex",
    flexDirection: "column",
    bgcolor: "background.default",
    height: "100%",
    minHeight: 0,
    overflow: "hidden",
  },
  tabSx = { minWidth: 200 },
  tabHeaderSx = {
    bgcolor: "white",
  },
  tabContentSx = {
    display: "flex",
    flexDirection: "column",
    px: 2,
    height: "100%",
    flex: 1,
    minHeight: 0,
  },
}: TabsShellProps) {
  const [value, setValue] = React.useState(String(initial));
  const handleChange = (_: React.SyntheticEvent, newValue: string) =>
    setValue(newValue);

  const kids = React.Children.toArray(children);

  return (
    <Box sx={sx}>
      <TabContext value={value}>
        <Box sx={{ ...tabHeaderSx }}>
          <TabList
            onChange={handleChange}
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-indicator": {
                top: 0,
                bottom: "auto",
              },
            }}
          >
            {tabs.map(({ id, label, href }, i) => (
              <Tab
                value={String(i)}
                key={id || label}
                label={label}
                component={Link}
                href={href ?? "#"}
                sx={tabSx}
                onClick={(e) => {
                  if (!href) e.preventDefault();
                }}
              />
            ))}
          </TabList>
        </Box>

        <Box sx={tabContentSx}>
          {kids.map((child, i) => (
            <TabPanel
              key={i}
              value={String(i)}
              sx={{ px: 0, py: 1, height: "100%" }}
            >
              {child}
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </Box>
  );
}
