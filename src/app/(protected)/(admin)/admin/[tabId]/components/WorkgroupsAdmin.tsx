"use client";
import {
  CollectionsSearchParams,
  CollectionWithHosts,
  Paginated,
} from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import { useEffect } from "react";
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

  if (!collections) return <Skeleton height={"100%"} />;

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
          middle={<WorkgroupsMiddlePanel />}
          right={<WorkgroupsRightPanel />}
        />
      </ThreePaneProvider>
    </Box>
  );
};

export default WorkgroupsAdmin;
