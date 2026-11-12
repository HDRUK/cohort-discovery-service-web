// Every dashboard route shows the tab bar (/dashboard itself redirects in
// next.config.ts). The bar reads open_queries, so it streams in its own
// Suspense and the tab content doesn't wait for it.
import { ReactNode, Suspense } from "react";
import { Box } from "@mui/material";
import {
  rootSx,
  tabContentSx,
  tabHeaderSx,
  tabPanelSx,
} from "@/components/TabsShell/TabsShell.styles";
import DashboardTabs from "./components/DashboardTabs";

const DashboardTabsLayout = ({ children }: { children: ReactNode }) => (
  <Box sx={rootSx}>
    <Suspense fallback={<Box sx={tabHeaderSx} />}>
      <DashboardTabs />
    </Suspense>
    <Box sx={tabContentSx}>
      <Box sx={tabPanelSx}>{children}</Box>
    </Box>
  </Box>
);

export default DashboardTabsLayout;
