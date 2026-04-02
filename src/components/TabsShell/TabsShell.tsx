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
  tabListSx as defaultTabListSx,
  tabPanelSx,
} from "./TabsShell.styles";
import { useRouter } from "next/navigation";
import { mergeSx } from "@/utils/helpers";

export type TabType = {
  page: React.ReactNode;
  id?: string;
  label: string;
  href?: string;
  route?: string;
  onCloseHref?: string;
  disabled?: boolean;
  handleClose?: () => void;
};

type TabsShellProps = {
  tabs: TabType[];
  value?: number | string;
  sx?: BoxProps["sx"];
  tabSx?: BoxProps["sx"];
  tabHeaderSx?: BoxProps["sx"];
  tabListSx?: BoxProps["sx"];
  tabContentSx?: BoxProps["sx"];
  forceValue?: boolean;
  endIcon?: React.ReactNode;
};

export default function TabsShell({
  tabs,
  value,
  sx,
  tabSx,
  tabHeaderSx,
  tabListSx,
  tabContentSx,
  forceValue = false,
  endIcon = null,
}: TabsShellProps) {
  const router = useRouter();
  const [internalValue, setInternalValue] = React.useState(
    value ? value : tabs[0]?.id || 0,
  );
  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    if (value && value === internalValue) return;
    setInternalValue(newValue);
  };

  const pages = tabs.map((tab) => tab.page);

  const kids = React.Children.toArray(pages);

  return (
    <Box sx={mergeSx(defaultRootSx, sx)}>
      <TabContext value={forceValue ? value || 0 : internalValue}>
        <Box
          sx={mergeSx(defaultTabHeaderSx, tabHeaderSx)}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <TabList
            onChange={handleChange}
            allowScrollButtonsMobile
            sx={mergeSx(defaultTabListSx, tabListSx)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map(
              ({ id, label, href, onCloseHref, disabled = false }, i) => {
                return (
                  <Tab
                    disabled={disabled}
                    value={id || i}
                    key={id || label}
                    label={
                      <Typography
                        variant="body1"
                        component="span"
                        sx={mergeSx(
                          { p: 0, m: 0 },
                          +internalValue === +(id || i)
                            ? { fontWeight: "600" }
                            : {},
                          disabled ? { display: "none" } : {},
                        )}
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
                    component={href ? Link : "a"}
                    href={href ?? undefined}
                    sx={mergeSx(
                      defaultTabSx,
                      tabSx,
                      disabled ? { display: "none" } : {},
                    )}
                    onClick={(e) => {
                      if (!href) e.preventDefault();
                    }}
                  />
                );
              },
            )}
          </TabList>
          <Box alignContent="center">{endIcon}</Box>
        </Box>

        {kids.length > 0 && (
          <Box sx={mergeSx(defaultTabContentSx, tabContentSx)}>
            {kids.map((child, i) => (
              <TabPanel key={i} value={tabs[i]?.id || i} sx={tabPanelSx}>
                {child}
              </TabPanel>
            ))}
          </Box>
        )}
      </TabContext>
    </Box>
  );
}
