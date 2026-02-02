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
import { useCallback, useEffect, useState } from "react";
import CollectionsTable from "@/components/CollectionsTable";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import CollectionsLeftPanel from "@/modules/CollectionsLeftPanel";
import CollectionsRightPanel from "@/modules/CollectionsRightPanel";
import { useLogDependencyChanges } from "@/utils/deps";
import useCustodianStore from "@/hooks/useCustodianStore";
import useAdminStore from "@/hooks/useAdminStore";

const CollectionsManagement = ({
  isAdmin,
  collections,
}: {
  isAdmin: boolean;
  collections: Paginated<CollectionWithHosts>;
}) => {
  const custodian = useCustodianStore(
    (custodianData) => custodianData.current.custodian,
  );

  const setAdminCollections = useAdminStore((s) => s.setCollections);
  const setCustodianCollections = useCustodianStore(
    (s) => s.current.setCollections,
  );

  useEffect(() => {
    if (isAdmin) setAdminCollections(collections);
    else setCustodianCollections(collections);
  }, [isAdmin, collections, setAdminCollections, setCustodianCollections]);

  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(null);
  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  const toggleExpandLeft = useCallback(() => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT,
    );
  }, [setExpandedSide]);

  const toggleExpandRight = useCallback(() => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT,
    );
  }, [setExpandedSide]);

  useLogDependencyChanges("CollectionsManagement", {
    custodian,
    expandedSide,
    expandedLeft,
    expandedRight,
    toggleExpandRight,
    toggleExpandLeft,
  });

  if (!isAdmin && !custodian) return <Skeleton height={"100%"} />;

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
            onCreate={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
          />
        }
        middle={<CollectionsTable />}
        right={
          <CollectionsRightPanel
            expandedRight={expandedRight}
            expandedLeft={expandedLeft}
            onClose={() => toggleExpandRight()}
          />
        }
      />
    </Box>
  );
};

export default CollectionsManagement;
