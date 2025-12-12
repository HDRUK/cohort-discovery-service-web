"use client";
import {
  Collection,
  CollectionWithHosts,
  Paginated,
  Custodian,
  Workgroup,
} from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useMemo, useState } from "react";
import { MRT_RowSelectionState } from "material-react-table";
// import { trueKeys } from "@/utils/numbers";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import WorkgroupsLeftPanel from "./WorkgroupsLeftPanel";
import WorkgroupsMiddlePanel from "./WorkgroupsMiddlePanel";
import WorkgroupsRightPanel from "./WorkgroupsRightPanel";
// import useSearchParams from "@/hooks/useSearchParams";

const WorkgroupsAdmin = ({
  collections,
  allCollections,
  custodians,
  workgroups,
}: {
  collections: Paginated<CollectionWithHosts[]>;
  allCollections: Collection[];
  custodians: Custodian[];
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
  // const { setSearchParam } = useSearchParams("workgroup_filter");

  const selectedWorkgroup = useMemo(() => {
    return selectedWorkgroupId
      ? workgroups.find((w) => w.id === selectedWorkgroupId)
      : undefined;
  }, [workgroups, selectedWorkgroupId]);
  console.log("selectedWorkgroup", selectedWorkgroup);
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  // const selectedCollectionIds = useMemo(
  //   () => trueKeys(rowSelection),
  //   [rowSelection]
  // );

  // const selectedCollection = useMemo(
  //   () =>
  //     selectedCollectionIds.length > 0
  //       ? collections.data.find(
  //           (h) =>
  //             String(h.id) ===
  //             selectedCollectionIds[selectedCollectionIds.length - 1]
  //         )
  //       : null,
  //   [collections, selectedCollectionIds]
  // );

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
            custodians={custodians}
            onCreate={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
            setSelectedWorkgroupId={setSelectedWorkgroupId}
          />
        }
        middle={
          <WorkgroupsMiddlePanel
            collections={collections}
            expandedLeft={expandedLeft}
            expandedRight={expandedRight}
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
            expandedLeft={expandedLeft}
            onClose={() => toggleExpandRight()}
          />
        }
      />
    </Box>
  );
};

export default WorkgroupsAdmin;
