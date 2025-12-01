"use client";
import { useState, useMemo } from "react";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionHost } from "@/types/api";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import { useNotify } from "@/providers/NotifyProvider";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import CollectionHostCreatePanel from "./CollectionHostCreatePanel";
import CollectionHostListPanel from "./CollectionHostListPanel";
import CollectionHostRightPanel from "./CollectionHostRightPanel";

const CollectionHostAdmin = ({
  pid,
  collectionHosts,
}: {
  pid: string;
  collectionHosts: CollectionHost[];
}) => {
  const notify = useNotify();
  const {
    custodianData: { custodians, deleteCollectionHost },
  } = useDaphneStore();

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const selectedHostIds = useMemo(() => trueKeys(rowSelection), [rowSelection]);

  const selectedCollectionHost = useMemo(
    () =>
      selectedHostIds.length > 0
        ? collectionHosts.find((h) => h.client_id === selectedHostIds[0])
        : null,
    [collectionHosts, selectedHostIds]
  );

  const [expandedSide, setExpandedSide] = useState<ExpandedSide | null>(null);

  const toggleExpandLeft = () => {
    setRowSelection({});
    setExpandedSide((prev) =>
      prev === ExpandedSide.LEFT ? null : ExpandedSide.LEFT
    );
  };

  const toggleExpandRight = () => {
    setExpandedSide((prev) =>
      prev === ExpandedSide.RIGHT ? null : ExpandedSide.RIGHT
    );
  };

  const expandedLeft = expandedSide === ExpandedSide.LEFT;
  const expandedRight = expandedSide === ExpandedSide.RIGHT;

  const custodian = custodians.find((c) => c.pid === pid);
  const noCollectionHosts = collectionHosts.length === 0;

  const handleDeleteHost = async () => {
    selectedHostIds.map((clientId) => {
      const id = collectionHosts.find((h) => h.client_id === clientId)?.id;
      if (id) {
        deleteCollectionHost(id);
      } else {
        notify.warning(`Did not find host ${clientId} to delete`);
      }
    });

    notify.success(`Deleted ${selectedHostIds.length} hosts`);
    setRowSelection({});
  };

  if (!custodian) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, height: "100%" }}
    >
      <Title title="Host" subTitle="Create" />
      <ThreePaneSwimLaneLayout
        expandedSide={expandedSide}
        rightDisabled={noCollectionHosts}
        panelWidth={3}
        left={
          <CollectionHostCreatePanel
            custodianId={custodian.id}
            expandedLeft={expandedLeft}
            onCreateNewHost={toggleExpandLeft}
            onCancelCreate={toggleExpandLeft}
          />
        }
        middle={
          <CollectionHostListPanel
            noCollectionHosts={noCollectionHosts}
            collectionHosts={collectionHosts}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onDeleteHost={handleDeleteHost}
          />
        }
        right={
          <CollectionHostRightPanel
            selectedCollectionHost={selectedCollectionHost || null}
            expandedRight={expandedRight}
            expandedLeft={expandedLeft}
            onClose={toggleExpandRight}
          />
        }
      />
    </Box>
  );
};

export default CollectionHostAdmin;
