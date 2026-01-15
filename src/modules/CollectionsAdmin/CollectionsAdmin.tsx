"use client";
import {
  CollectionWithHosts,
  CollectionHost,
  Paginated,
  CollectionsSearchParams,
  Workgroup,
  Custodian,
} from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useCallback, useState } from "react";
import CollectionsTable from "@/components/CollectionsTable";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import CollectionsLeftPanel from "@/modules/CollectionsLeftPanel";
import CollectionsRightPanel from "@/modules/CollectionsRightPanel";
import { useLogDependencyChanges } from "@/utils/deps";
import useCustodianStore from "@/store/useCustodianStore";

const CollectionsAdmin = ({
  admin = false,
  custodians = undefined,
  collections,
  collectionHosts,
  workgroups,
}: {
  admin?: boolean;
  custodians?: Custodian[] | undefined;
  collections: Paginated<CollectionWithHosts[]>;
  collectionHosts: CollectionHost[];
  workgroups: Workgroup[];
}) => {
  const custodian = useCustodianStore(
    (custodianData) => custodianData.currentCustodian
  );

  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(null);
  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  const toggleExpandLeft = useCallback(() => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT
    );
  }, [setExpandedSide]);

  const toggleExpandRight = useCallback(() => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT
    );
  }, [setExpandedSide]);

  useLogDependencyChanges("CollectionsAdmin", {
    custodian,
    collections,
    collectionHosts,
    expandedSide,
    expandedLeft,
    expandedRight,
    toggleExpandRight,
    toggleExpandLeft,
  });

  if (!admin && !custodian) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Collections" subTitle="Management" />
      <ControlledSearchBox<CollectionsSearchParams>
        paramName="search_term"
        placeholder="Search by collection name..."
      />
      <ThreePaneSwimLaneLayout
        expandedSide={expandedSide}
        rightDisabled={false}
        left={
          <CollectionsLeftPanel
            expandedLeft={expandedLeft}
            collectionHosts={collectionHosts}
            custodians={custodians}
            onCreate={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
          />
        }
        middle={<CollectionsTable admin={admin} initialData={collections} />}
        right={
          <CollectionsRightPanel
            collectionHosts={collectionHosts}
            workgroups={workgroups}
            expandedRight={expandedRight}
            expandedLeft={expandedLeft}
            onClose={() => toggleExpandRight()}
          />
        }
      />
    </Box>
  );
};

export default CollectionsAdmin;
