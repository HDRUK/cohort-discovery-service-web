"use client";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionWithHosts, CollectionHost, Paginated } from "@/types/api";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import { useMemo, useState } from "react";
import CollectionsLeftPanel from "./CollectionsLeftPanel";
import CollectionsTable from "@/components/CollectionsTable";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import ControlledSearchBox from "@/modules/ControlledSearchBox";
import CollectionsRightPanel from "./CollectionsRightPanel";

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

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const selectedCollectionIds = useMemo(
    () => trueKeys(rowSelection),
    [rowSelection]
  );

  const selectedCollection = useMemo(
    () =>
      selectedCollectionIds.length > 0
        ? collections.data.find(
            (h) =>
              String(h.id) ===
              selectedCollectionIds[selectedCollectionIds.length - 1]
          )
        : null,
    [collections, selectedCollectionIds]
  );

  const custodian = custodians.find((c) => c.pid === pid);

  if (!custodian) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Collections" subTitle="Create" />
      <ControlledSearchBox
        paramName="search_collection"
        placeholder="Search by collection name..."
      />
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
          <CollectionsTable
            collections={collections}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        }
        right={
          <CollectionsRightPanel
            selectedCollection={selectedCollection || null}
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
