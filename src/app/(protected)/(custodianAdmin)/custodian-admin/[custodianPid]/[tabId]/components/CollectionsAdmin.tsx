"use client";
import CreateCollection from "@/modules/CreateCollection";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionWithHosts, CollectionHost, Paginated } from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import CollectionTable from "./CollectionTable";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useState } from "react";
import CollectionsLeftPanel from "./CollectionsLeftPanel";
import CollectionsMiddlePanel from "./CollectionsMiddlePanel";

const CollectionAdmin = ({
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
      <Title title="Collections" subTitle="Create" />
      <ThreePaneSwimLaneLayout
        expandedSide={expandedSide}
        rightDisabled={false}
        panelWidth={3}
        left={
          <CollectionsLeftPanel
            expandedLeft={expandedLeft}
            custodian={custodian}
            collectionHosts={collectionHosts}
            onCreate={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
          />
        }
        middle={
          <CollectionsMiddlePanel
            expandedLeft={expandedLeft}
            collections={collections}
          />
        }
        right={<b> hi3</b>}
      />
    </Box>
  );
};

export default CollectionAdmin;
