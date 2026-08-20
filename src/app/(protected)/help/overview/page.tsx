"use client";

import { Box } from "@mui/material";
import QueryBuilderGuidance from "@/app/(protected)/dashboard/[tabId]/components/QueryBuilderGuidance";
import { baseComponents } from "@/modules/Guidance/Guidance";
import Video from "../components/Video";
import OverviewMdx from "./overview.mdx";

const components = {
  ...baseComponents,
  Video,
  QueryBuilderGuidance,
};

const OverviewPage = () => {
  return (
    <Box sx={{ overflowY: "scroll", height: "auto" }}>
      <OverviewMdx components={components} />
    </Box>
  );
};

export default OverviewPage;
