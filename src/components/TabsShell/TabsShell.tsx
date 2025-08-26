"use client";

import * as React from "react";
import { Box, BoxProps, Tab } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

type TabsShellProps = {
  labels: string[];
  children: React.ReactNode[];
  initial?: number;
  sx?: BoxProps;
};

export default function TabsShell({
  labels,
  children,
  initial = 0,
  sx,
}: TabsShellProps) {
  const [value, setValue] = React.useState(String(initial));
  const handleChange = (_: React.SyntheticEvent, newValue: string) =>
    setValue(newValue);

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            variant="scrollable"
            allowScrollButtonsMobile
          >
            {labels.map((label, i) => (
              <Tab key={label} label={label} value={String(i)} />
            ))}
          </TabList>
        </Box>

        {children.map((child, i) => (
          <TabPanel key={i} value={String(i)} sx={{ px: 0 }}>
            {child}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
