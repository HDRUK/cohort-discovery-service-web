"use client";
import {
  CollectionsSearchParams,
  CollectionWithHosts,
  Paginated,
} from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useEffect, useState } from "react";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import WorkgroupsLeftPanel from "./WorkgroupsLeftPanel";
import WorkgroupsMiddlePanel from "./WorkgroupsMiddlePanel";
import WorkgroupsRightPanel from "./WorkgroupsRightPanel";
import { useAdminDataStore } from "@/store/adminDataStore";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";

const WorkgroupsAdmin = ({
  collections,
}: {
  collections: Paginated<CollectionWithHosts>;
}) => {
  const setCollections = useAdminDataStore((s) => s.setCollections);
  useEffect(() => {
    setCollections(collections);
  }, [collections, setCollections]);

  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(null);
  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  const toggleExpandLeft = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT,
    );
  };

  const toggleExpandRight = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT,
    );
  };

  if (!collections) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Workgroups" subTitle="Management" />
      <ControlledSearchBox<CollectionsSearchParams>
        paramName="search_term"
        placeholder="Search by collection name or username..."
      />
      <ThreePaneProvider>
        <ThreePaneSwimLaneLayout
          rightDisabled={false}
          left={
            <WorkgroupsLeftPanel
              expandedLeft={expandedLeft}
              onCreate={toggleExpandLeft}
              onCancelCreate={toggleExpandLeft}
            />
          }
          middle={<WorkgroupsMiddlePanel />}
          right={
            <WorkgroupsRightPanel
              expandedRight={expandedRight}
              onClose={() => toggleExpandRight()}
            />
          }
        />
      </ThreePaneProvider>
    </Box>
  );
};

export default WorkgroupsAdmin;
