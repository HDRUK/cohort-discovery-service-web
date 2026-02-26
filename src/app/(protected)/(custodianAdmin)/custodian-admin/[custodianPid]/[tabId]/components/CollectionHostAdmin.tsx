"use client";
import { useState, useMemo } from "react";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import { CollectionHost } from "@/types/api";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import { useNotify } from "@/providers/NotifyProvider";
import ThreePaneSwimLaneLayout from "@/modules/ThreePaneSwimLaneLayout";
import CollectionHostLeftPanel from "./CollectionHostLeftPanel";
import CollectionHostListPanel from "./CollectionHostListPanel";
import CollectionHostRightPanel from "./CollectionHostRightPanel";

import useUserStore from "@/hooks/useUserStore";
import useCustodianStore from "@/hooks/useCustodianStore";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";

const CollectionHostAdmin = ({
  pid,
  collectionHosts,
}: {
  pid: string;
  collectionHosts: CollectionHost[];
}) => {
  const notify = useNotify();

  const custodians = useUserStore((s) => s.custodians);
  const deleteCollectionHost = useCustodianStore((s) => s.deleteCollectionHost);

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const selectedHostIds = useMemo(() => trueKeys(rowSelection), [rowSelection]);

  const selectedCollectionHost = useMemo(
    () =>
      selectedHostIds.length > 0
        ? collectionHosts.find((h) => h.client_id === selectedHostIds[0])
        : null,
    [collectionHosts, selectedHostIds],
  );

  const custodian = custodians.find((c) => c.pid === pid);
  const noCollectionHosts = collectionHosts.length === 0;

  const handleDeleteHost = async () => {
    selectedHostIds.forEach((clientId) => {
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
    <ThreePaneProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
        }}
      >
        <Title title="Host" subTitle="Create" />
        <ThreePaneSwimLaneLayout
          rightDisabled={noCollectionHosts}
          left={<CollectionHostLeftPanel custodianId={custodian.id} />}
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
            />
          }
        />
      </Box>
    </ThreePaneProvider>
  );
};

export default CollectionHostAdmin;
