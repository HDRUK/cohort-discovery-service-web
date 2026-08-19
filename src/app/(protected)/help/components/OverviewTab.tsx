"use client";

import { Box } from "@mui/material";
import QueryBuilderGuidance from "@/app/(protected)/dashboard/[tabId]/components/QueryBuilderGuidance";
import OverviewMdx from "@/content/help/overview.mdx";
import { baseComponents } from "@/modules/Guidance/Guidance";
import Video from "./Video";

const components = {
  ...baseComponents,
  Video,
  QueryBuilderGuidance,
};

const OverviewTab = () => {
  return (
    <Box sx={{ overflowY: "scroll", height: "auto" }}>
      <OverviewMdx components={components} />
    </Box>
  );
};

export default OverviewTab;
