"use client";
import {
  Collection,
  CollectionWithHosts,
  Paginated,
  Workgroup,
} from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useMemo, useState } from "react";
import { MRT_RowSelectionState } from "material-react-table";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import WorkgroupsLeftPanel from "./WorkgroupsLeftPanel";
import WorkgroupsMiddlePanel from "./WorkgroupsMiddlePanel";
import WorkgroupsRightPanel from "./WorkgroupsRightPanel";

const WorkgroupsAdmin = ({
  collections,
  allCollections,
  workgroups,
}: {
  collections: Paginated<CollectionWithHosts[]>;
  allCollections: Collection[];
  workgroups: Workgroup[];
}) => {
  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(null);
  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  const toggleExpandLeft = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT
    );
  };

  const toggleExpandRight = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT
    );
  };

  const [selectedWorkgroupId, setSelectedWorkgroupId] = useState<
    number | undefined
  >(undefined);

  const selectedWorkgroup = useMemo(() => {
    return selectedWorkgroupId
      ? workgroups.find((w) => w.id === selectedWorkgroupId)
      : undefined;
  }, [workgroups, selectedWorkgroupId]);

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  if (!collections) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Workgroups" subTitle="Management" />
      <ControlledSearchBox
        paramName="search_collections"
        placeholder="Search by collection name or username..."
      />
      <ThreePaneSwimLaneLayout
        expandedSide={expandedSide}
        rightDisabled={false}
        panelWidth={3}
        left={
          <WorkgroupsLeftPanel
            workgroups={workgroups}
            expandedLeft={expandedLeft}
            collections={allCollections}
            onCreate={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
            setSelectedWorkgroupId={setSelectedWorkgroupId}
          />
        }
        middle={
          <WorkgroupsMiddlePanel
            collections={collections}
            selectedWorkgroup={selectedWorkgroup}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        }
        right={
          <WorkgroupsRightPanel
            selectedWorkgroup={selectedWorkgroup || null}
            collections={allCollections}
            expandedRight={expandedRight}
            onClose={() => toggleExpandRight()}
          />
        }
      />
    </Box>
  );
};

export default WorkgroupsAdmin;
