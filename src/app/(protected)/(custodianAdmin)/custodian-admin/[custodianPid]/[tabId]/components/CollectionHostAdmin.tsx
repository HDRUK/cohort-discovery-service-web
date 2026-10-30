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
import { useConfirm } from "@/hooks/useConfirm";
import useSearchParams from "@/hooks/useSearchParams";
import { CollectionHostFilter } from "@/types/collections";

const CollectionHostAdmin = ({
  pid,
  collectionHosts,
}: {
  pid: string;
  collectionHosts: CollectionHost[];
}) => {
  const notify = useNotify();
  const confirm = useConfirm();
  const { getSearchParam } = useSearchParams("collection_host_filter");
  const isDeletedView = getSearchParam() === CollectionHostFilter.DELETED;

  const custodians = useUserStore((s) => s.custodians);
  const deleteCollectionHost = useCustodianStore((s) => s.deleteCollectionHost);
  const restoreCollectionHost = useCustodianStore(
    (s) => s.restoreCollectionHost,
  );

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
    const isPlural = selectedHostIds.length > 1;
    const hostNames = selectedHostIds
      .map((clientId) => collectionHosts.find((h) => h.client_id === clientId))
      .filter((h): h is CollectionHost => !!h)
      .map((h) => h.name)
      .join(", ");

    const result = await confirm({
      title: `Delete host${isPlural ? "s" : ""}`,
      description: `${hostNames} will be deleted. ${isPlural ? "Their" : "Its"} client ID and secret will stop working immediately, and linked collections will lose their host. ${isPlural ? "They" : "It"} can be restored from Deleted Hosts with the same credentials.`,
      confirmText: "Delete",
      confirmColor: "error",
    });
    if (result !== "confirm") return;

    await Promise.all(
      selectedHostIds.map((clientId) => {
        const id = collectionHosts.find((h) => h.client_id === clientId)?.id;
        if (id) {
          return deleteCollectionHost(id);
        }
        notify.warning(`Did not find host ${clientId} to delete`);
      }),
    );

    notify.success(
      `Deleted ${selectedHostIds.length} host${isPlural ? "s" : ""} — credentials stop working until restored`,
    );
    setRowSelection({});
  };

  const handleRestoreHost = async () => {
    await Promise.all(
      selectedHostIds.map((clientId) => {
        const id = collectionHosts.find((h) => h.client_id === clientId)?.id;
        if (id) {
          return restoreCollectionHost(id);
        }
        notify.warning(`Did not find host ${clientId} to restore`);
      }),
    );

    notify.success(
      `Restored ${selectedHostIds.length} host${selectedHostIds.length > 1 ? "s" : ""} — credentials work again`,
    );
    setRowSelection({});
  };

  if (!custodian) return <Skeleton height={"100%"} />;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      <Title title="Host" subTitle="Create" />
      <ThreePaneProvider>
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
              onRestoreHost={handleRestoreHost}
              isDeletedView={isDeletedView}
            />
          }
          right={
            <CollectionHostRightPanel
              selectedCollectionHost={selectedCollectionHost || null}
            />
          }
        />
      </ThreePaneProvider>
    </Box>
  );
};

export default CollectionHostAdmin;
