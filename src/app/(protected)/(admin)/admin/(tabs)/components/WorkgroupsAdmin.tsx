"use client";
import { ReactNode } from "react";
import { CollectionsSearchParams } from "@/types/api";
import { Box } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import WorkgroupsLeftPanel from "./WorkgroupsLeftPanel";
import WorkgroupsMiddlePanel from "./WorkgroupsMiddlePanel";
import WorkgroupsRightPanel from "./WorkgroupsRightPanel";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";

const WorkgroupsAdmin = ({
  middle = <WorkgroupsMiddlePanel />,
}: {
  middle?: ReactNode;
}) => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Workgroups" subTitle="Management" />
      <ControlledSearchBox<CollectionsSearchParams>
        paramName="search_term"
        placeholder="Search by collection name or username..."
        submitOnChange
      />
      <ThreePaneProvider>
        <ThreePaneSwimLaneLayout
          rightDisabled={false}
          left={<WorkgroupsLeftPanel />}
          middle={middle}
          right={<WorkgroupsRightPanel />}
        />
      </ThreePaneProvider>
    </Box>
  );
};

export default WorkgroupsAdmin;
