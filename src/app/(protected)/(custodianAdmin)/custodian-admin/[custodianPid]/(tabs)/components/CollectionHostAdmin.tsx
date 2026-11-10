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

import useCustodianStore from "@/hooks/useCustodianStore";
import { ThreePaneProvider } from "@/providers/ThreePaneProvider";
import { useConfirm } from "@/hooks/useConfirm";
import useSearchParams from "@/hooks/useSearchParams";
import { CollectionHostFilter } from "@/types/collections";
import { useSessionData } from "@/contexts/SessionDataContext";

const NO_HOSTS: CollectionHost[] = [];

const CollectionHostAdmin = ({
  pid,
  collectionHosts,
}: {
  pid: string;
  collectionHosts?: CollectionHost[];
}) => {
  const loadedHosts = collectionHosts ?? NO_HOSTS;
  const notify = useNotify();
  const confirm = useConfirm();
  const { getSearchParam } = useSearchParams("collection_host_filter");
  const isDeletedView = getSearchParam() === CollectionHostFilter.DELETED;

  const custodians = useSessionData().custodians;
  const deleteCollectionHost = useCustodianStore((s) => s.deleteCollectionHost);
  const restoreCollectionHost = useCustodianStore(
    (s) => s.restoreCollectionHost,
  );

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const selectedHostIds = useMemo(() => trueKeys(rowSelection), [rowSelection]);

  const selectedCollectionHost = useMemo(
    () =>
      selectedHostIds.length > 0
        ? loadedHosts.find((h) => String(h.id) === selectedHostIds[0])
        : null,
    [loadedHosts, selectedHostIds],
  );

  const custodian = custodians.find((c) => c.pid === pid);
  const noCollectionHosts = collectionHosts?.length === 0;

  const handleDeleteHost = async () => {
    const isPlural = selectedHostIds.length > 1;
    const hostNames = selectedHostIds
      .map((hostId) => loadedHosts.find((h) => String(h.id) === hostId))
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
      selectedHostIds.map((hostId) => {
        const id = loadedHosts.find((h) => String(h.id) === hostId)?.id;
        if (id) {
          return deleteCollectionHost(id);
        }
        notify.warning(`Did not find host ${hostId} to delete`);
      }),
    );

    notify.success(
      `Deleted ${selectedHostIds.length} host${isPlural ? "s" : ""} — credentials stop working until restored`,
    );
    setRowSelection({});
  };

  const handleRestoreHost = async () => {
    const hosts = selectedHostIds
      .map((hostId) => loadedHosts.find((h) => String(h.id) === hostId))
      .filter((h): h is CollectionHost => !!h);
    const results = await Promise.all(
      hosts.map(async (host) => ({
        host,
        result: await restoreCollectionHost(host.id),
      })),
    );
    const failed = results.filter(({ result }) => result.error);
    const restoredCount = results.length - failed.length;
    const isPlural = results.length > 1;

    if (failed.length > 0) {
      notify.error(
        `Restored ${restoredCount} of ${results.length} host${isPlural ? "s" : ""}. Could not restore ${failed.map(({ host, result }) => `${host.name} (${result.error?.text})`).join(", ")} — check the details and try again`,
      );
      setRowSelection(
        Object.fromEntries(failed.map(({ host }) => [String(host.id), true])),
      );
      return;
    }

    notify.success(
      `Restored ${restoredCount} host${isPlural ? "s" : ""} — credentials work again`,
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
