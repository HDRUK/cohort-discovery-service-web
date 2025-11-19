"use client";

import * as React from "react";
import { Box, BoxProps, Tab, IconButton, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Link from "next/link";
import CloseIcon from "@mui/icons-material/Close";

import {
  rootSx as defaultRootSx,
  tabSx as defaultTabSx,
  tabHeaderSx as defaultTabHeaderSx,
  tabContentSx as defaultTabContentSx,
  tabListSx,
  tabPanelSx,
} from "./TabsShell.styles";
import { useRouter } from "next/navigation";

type TabType = {
  id?: string;
  label: string;
  href?: string;
  onCloseHref?: string;
};

type TabsShellProps = {
  tabs: TabType[];
  children: React.ReactNode | React.ReactNode[];
  initial?: number | string;
  sx?: BoxProps["sx"];
  tabSx?: BoxProps["sx"];
  tabHeaderSx?: BoxProps["sx"];
  tabContentSx?: BoxProps["sx"];
};

export default function TabsShell({
  tabs,
  children,
  initial,
  sx = defaultRootSx,
  tabSx = defaultTabSx,
  tabHeaderSx = defaultTabHeaderSx,
  tabContentSx = defaultTabContentSx,
}: TabsShellProps) {
  const [value, setValue] = React.useState(
    initial ? initial : tabs[0]?.id || 0
  );
  const handleChange = (_: React.SyntheticEvent, newValue: string) =>
    setValue(newValue);

  const kids = React.Children.toArray(children);
  const router = useRouter();

  return (
    <Box sx={sx}>
      <TabContext value={value}>
        <Box sx={tabHeaderSx}>
          <TabList
            onChange={handleChange}
            allowScrollButtonsMobile
            sx={tabListSx}
          >
            {tabs.map(({ id, label, href, onCloseHref }, i) => (
              <Tab
                value={id || i}
                key={id || label}
                label={
                  <Typography
                    sx={{ p: 0, m: 0 }}
                    variant="body1"
                    component="span"
                  >
                    {label}
                    {onCloseHref && (
                      <IconButton
                        size="small"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.replace(onCloseHref);
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Typography>
                }
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
            <TabPanel key={i} value={tabs[i]?.id || i} sx={tabPanelSx}>
              {child}
            </TabPanel>
          ))}
        </Box>
      </TabContext>
    </Box>
  );
}
