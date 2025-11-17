"use client";

import * as React from "react";
import { Box, BoxProps, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Link from "next/link";

import {
  rootSx as defaultRootSx,
  tabSx as defaultTabSx,
  tabHeaderSx as defaultTabHeaderSx,
  tabContentSx as defaultTabContentSx,
  tabListSx,
  tabPanelSx,
} from "./TabsShell.styles";

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
  tabSx?: BoxProps["sx"];
  tabHeaderSx?: BoxProps["sx"];
  tabContentSx?: BoxProps["sx"];
};

export default function TabsShell({
  tabs,
  children,
  initial = 0,
  sx = defaultRootSx,
  tabSx = defaultTabSx,
  tabHeaderSx = defaultTabHeaderSx,
  tabContentSx = defaultTabContentSx,
}: TabsShellProps) {
  const [value, setValue] = React.useState(String(initial));
  const handleChange = (_: React.SyntheticEvent, newValue: string) =>
    setValue(newValue);

  const kids = React.Children.toArray(children);

  return (
    <Box sx={sx}>
      <TabContext value={value}>
        <Box sx={tabHeaderSx}>
          <TabList
            onChange={handleChange}
            allowScrollButtonsMobile
            sx={tabListSx}
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
            <TabPanel key={i} value={String(i)} sx={tabPanelSx}>
              {child}
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </Box>
  );
}
