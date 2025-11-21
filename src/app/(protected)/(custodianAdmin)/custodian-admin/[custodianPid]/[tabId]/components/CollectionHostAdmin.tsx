"use client";
import { useState, useMemo, useEffect } from "react";
import { Box, Skeleton } from "@mui/material";
import Title from "@/components/Title";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionHost } from "@/types/api";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import { useNotify } from "@/providers/NotifyProvider";
import { useForm } from "react-hook-form";
import ThreePaneSwimLaneLayout, {
  ExpandedSide,
} from "@/modules/ThreePaneSwimLaneLayout";
import CollectionHostCreatePanel from "./CollectionHostCreatePanel";
import CollectionHostListPanel from "./CollectionHostListPanel";
import CollectionHostDetailPanel from "./CollectionHostDetailPanel";

type CollectionHostFormValues = { hostName: string };

const CollectionHostAdmin = ({
  pid,
  collectionHosts,
}: {
  pid: string;
  collectionHosts: CollectionHost[];
}) => {
  const notify = useNotify();
  const {
    custodianData: { custodians, updateCollectionHost, deleteCollectionHost },
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

  const { handleSubmit, control, setValue } = useForm<CollectionHostFormValues>(
    {
      defaultValues: {
        hostName: selectedCollectionHost?.name,
      },
    }
  );

  useEffect(() => {
    if (selectedCollectionHost)
      setValue("hostName", selectedCollectionHost.name);
  }, [selectedCollectionHost, setValue]);

  const submitHostForm = async (
    { hostName }: CollectionHostFormValues,
    closeAfter = false
  ) => {
    if (!selectedCollectionHost?.id) return;
    const { id } = selectedCollectionHost;

    if (hostName !== selectedCollectionHost.name) {
      await updateCollectionHost(id, { name: hostName });
      notify.success(`Updated host name ${hostName}`);
    }

    if (closeAfter) {
      toggleExpandRight();
    }
  };

  const handleEnter = handleSubmit((values) => submitHostForm(values, false));
  const handleLockClick = handleSubmit((values) =>
    submitHostForm(values, true)
  );

  const handleUnlockClick = () => {
    toggleExpandRight();
  };

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
            hasSelection={selectedHostIds.length > 0}
          />
        }
        middleProps={{ hideOnTransiton: false }}
        right={
          <CollectionHostDetailPanel
            selectedCollectionHost={selectedCollectionHost || null}
            expandedRight={expandedRight}
            expandedLeft={expandedLeft}
            control={control}
            handleEnter={handleEnter}
            handleLockClick={handleLockClick}
            handleUnlockClick={handleUnlockClick}
          />
        }
        rightProps={{ hideOnTransiton: false }}
      />
    </Box>
  );
};

export default CollectionHostAdmin;
