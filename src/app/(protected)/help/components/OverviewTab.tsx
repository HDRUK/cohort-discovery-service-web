"use client";

import { Box } from "@mui/material";
import QueryBuilderGuidance from "@/app/(protected)/dashboard/[tabId]/components/QueryBuilderGuidance";
import { IFrameWrapper } from "./IFrameWrapper";

const OverviewTab = () => {
  return (
    <>
      <Box display="flex" sx={{ justifyContent: "center", pt: 2 }}>
        <IFrameWrapper>
          <iframe
            loading="lazy"
            title="Cohort Discovery: Advanced Query Tutorial"
            src="https://www.youtube.com/embed/oM3j3me6XvE?list=PLBI5k9SgYrIvz_h0hq83yFnTM4t9P569b&index=4&feature=oembed"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: "0", borderRadius: "10px" }}
          ></iframe>
        </IFrameWrapper>
      </Box>
      <QueryBuilderGuidance />
    </>
  );
};

export default OverviewTab;
