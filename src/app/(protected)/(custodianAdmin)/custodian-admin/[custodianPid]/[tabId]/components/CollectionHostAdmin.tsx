"use client";
import CreateCollectionHost from "@/modules/CreateCollectionHost";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionHost } from "@/types/api";
import {
  Box,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CollectionHostsTable from "./CollectionHostsTable";
import Title from "@/components/Title";
import SwimLane from "@/components/SwimLane";
import SwimLaneContainer from "@/components/SwimLaneContainer";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import { useState, useMemo, useEffect } from "react";
import Guidance from "./Guidance";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import CopyableVariable from "@/components/CopyableVariable";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { Controller, useForm } from "react-hook-form";
import { useNotify } from "@/providers/NotifyProvider";

const PANEL_WIDTH = 3;
enum ExpandedSide {
  LEFT = "left",
  RIGHT = "right",
}

type HostFormValues = { hostName: string };

const getPanelSizes = (
  expanded: ExpandedSide | null,
  noHosts: boolean,
  panelWidth: number = PANEL_WIDTH,
  totalWidth: number = 12
) => {
  if (expanded === ExpandedSide.LEFT) {
    return {
      left: totalWidth - panelWidth,
      middle: 0,
      right: panelWidth,
    };
  }

  if (expanded === ExpandedSide.RIGHT) {
    return {
      left: 1,
      middle: noHosts ? totalWidth - panelWidth : 2 * panelWidth - 0.5,
      right: noHosts ? 0 : 2 * panelWidth - 0.5,
    };
  }

  return {
    left: panelWidth,
    middle: noHosts ? totalWidth - panelWidth : totalWidth - 2 * panelWidth,
    right: noHosts ? 0 : panelWidth,
  };
};

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

  const selectedHost = useMemo(
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

  const createNewHost = () => toggleExpandLeft();

  const custodian = custodians.find((c) => c.pid === pid);
  const noHosts = collectionHosts.length === 0;

  const {
    left: leftSize,
    middle: middleSize,
    right: rightSize,
  } = getPanelSizes(expandedSide, noHosts, PANEL_WIDTH);

  const { handleSubmit, control, setValue } = useForm<HostFormValues>({
    defaultValues: {
      hostName: selectedHost?.name,
    },
  });

  useEffect(() => {
    if (selectedHost) setValue("hostName", selectedHost.name);
  }, [selectedHost, setValue]);

  const submitHostForm = async (
    { hostName }: HostFormValues,
    closeAfter = false
  ) => {
    if (!selectedHost?.id) return;
    const { id } = selectedHost;

    if (hostName !== selectedHost.name) {
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
    selectedHostIds.map((pid) => {
      const id = collectionHosts.find((h) => h.client_id === pid)?.id;
      if (id) {
        deleteCollectionHost(id);
      } else {
        notify.warning(`Did not find host ${pid} to delete`);
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
      <SwimLaneContainer>
        <SwimLane size={leftSize}>
          <Box
            sx={{
              px: 1,
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
            }}
          >
            <ActionMenuSection
              title={"Create"}
              fixedExpanded
              defaultExpanded
              underline
            >
              <AddButton
                action={createNewHost}
                label={"Host"}
                disabled={expandedLeft}
              />
            </ActionMenuSection>

            {expandedLeft && (
              <ActionMenuSection
                title={"New Host"}
                fixedExpanded
                defaultExpanded
                underline
                scrollable
              >
                <CreateCollectionHost
                  custodianId={custodian.id}
                  onCancel={() => toggleExpandLeft()}
                />
              </ActionMenuSection>
            )}
          </Box>
        </SwimLane>

        <SwimLane size={middleSize}>
          {noHosts ? (
            <Box sx={{ mx: "auto", my: "auto" }}>
              <Typography variant="h5">
                Collection hosts will appear here when they are created
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  minHeight: 40,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div></div>
                {selectedHostIds.length > 0 && (
                  <IconButton onClick={() => handleDeleteHost()}>
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>

              <CollectionHostsTable
                collectionHosts={collectionHosts}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
              />
            </Box>
          )}
        </SwimLane>

        <SwimLane size={rightSize}>
          {selectedHost ? (
            <>
              <Typography component="span" variant="overline">
                Host
                <IconButton
                  size="small"
                  sx={{ ml: "auto" }}
                  onClick={() => {
                    if (expandedRight) {
                      handleLockClick();
                    } else {
                      handleUnlockClick();
                    }
                  }}
                >
                  {expandedRight ? <LockOpenIcon /> : <LockOutlineIcon />}
                </IconButton>
              </Typography>

              <ActionMenuSection
                title={"Host Name"}
                fixedExpanded
                defaultExpanded
                underline
              >
                {expandedRight ? (
                  <Controller
                    name="hostName"
                    control={control}
                    rules={{ required: "Host name is required" }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        slotProps={{ input: { sx: { borderRadius: 0 } } }}
                        error={!!error}
                        helperText={error?.message}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleEnter();
                          }
                        }}
                      />
                    )}
                  />
                ) : (
                  selectedHost.name
                )}
              </ActionMenuSection>
              <ActionMenuSection
                title={"Host Credentials"}
                fixedExpanded
                defaultExpanded
                underline
              >
                Client ID
                <CopyableVariable value={selectedHost.client_id} />
                Client Secret
                <CopyableVariable hidden value={selectedHost.client_secret} />
              </ActionMenuSection>
            </>
          ) : (
            <Guidance creating={expandedLeft} />
          )}
        </SwimLane>
      </SwimLaneContainer>
    </Box>
  );
};

export default CollectionHostAdmin;
