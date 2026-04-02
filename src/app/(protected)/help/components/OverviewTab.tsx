import { Box } from "@mui/material";
import QueryBuilderGuidance from "@/app/(protected)/dashboard/[tabId]/components/QueryBuilderGuidance";
import { IFrameWrapper } from "./IFrameWrapper";

const OverviewTab = () => {
  return (
    <>
      <Box display="flex" sx={{ justifyContent: "center" }}>
        <IFrameWrapper>
          <iframe
            loading="lazy"
            title="Cohort Discovery on the Health Data Research Innovation Gateway"
            src="https://www.youtube.com/embed/yvFrnbXlqRk?feature=oembed"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ border: "0" }}
          ></iframe>
        </IFrameWrapper>
      </Box>
      <QueryBuilderGuidance />
    </>
  );
};

export default OverviewTab;
