"use client";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionWithHosts, CollectionHost, Paginated } from "@/types/api";
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

const CollectionsCustodianAdmin = ({
  pid,
  collections,
  collectionHosts,
}: {
  pid: string;
  collections: Paginated<CollectionWithHosts[]>;
  collectionHosts: CollectionHost[];
}) => {
  const {
    custodianData: { custodians },
  } = useDaphneStore();

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

  const custodian = custodians.find((c) => c.pid === pid);

  if (!custodian) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Collections" subTitle="Management" />
      <ControlledSearchBox
        paramName="search_collection"
        placeholder="Search by collection name..."
      />
      <ThreePaneSwimLaneLayout
        expandedSide={expandedSide}
        rightDisabled={false}
        left={
          <CollectionsLeftPanel
            expandedLeft={expandedLeft}
            collectionHosts={collectionHosts}
            onCreate={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
          />
        }
        middle={<CollectionsTable initialData={collections} />}
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

export default CollectionsCustodianAdmin;
