"use client";

import * as React from "react";
import { Box, BoxProps, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Link from "next/link";

type TabType = {
  id: string;
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
    bgcolor: "background.default",
  },
  tabHeaderSx = {
    bgcolor: "white",
  },
  tabContentSx = {
    px: 2,
  },
}: TabsShellProps) {
  const [value, setValue] = React.useState(String(initial));
  const handleChange = (_: React.SyntheticEvent, newValue: string) =>
    setValue(newValue);

  const kids = React.Children.toArray(children);

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <TabContext value={value}>
        <Box sx={{ ...tabHeaderSx }}>
          <TabList
            onChange={handleChange}
            variant="scrollable"
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
                key={id}
                label={label}
                component={Link}
                href={href ?? "#"}
                onClick={(e) => {
                  if (!href) e.preventDefault();
                }}
              />
            ))}
          </TabList>
        </Box>

        <Box sx={{ ...tabContentSx }}>
          {kids.map((child, i) => (
            <TabPanel key={i} value={String(i)} sx={{ px: 0 }}>
              {child}
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </Box>
  );
}
