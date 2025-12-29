"use client";
import {
  CollectionWithHosts,
  CollectionHost,
  Paginated,
  Custodian,
  CollectionsSearchParams,
} from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useState } from "react";
import CollectionsLeftPanel from "./CollectionsLeftPanel";
import CollectionsTable from "@/components/CollectionsTable";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import CollectionsRightPanel from "@/modules/CollectionsRightPanel";

const CollectionAdmin = ({
  collections,
  collectionHosts,
  custodians,
}: {
  collections: Paginated<CollectionWithHosts[]>;
  collectionHosts: CollectionHost[];
  custodians: Custodian[];
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

  if (!collections) return <Skeleton height={"100%"} />;

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
        middle={<CollectionsTable admin initialData={collections} />}
        right={
          <CollectionsRightPanel
            collectionHosts={collectionHosts}
            expandedRight={expandedRight}
            expandedLeft={expandedLeft}
            onClose={() => toggleExpandRight()}
          />
        }
      />
    </Box>
  );
};

export default CollectionAdmin;
