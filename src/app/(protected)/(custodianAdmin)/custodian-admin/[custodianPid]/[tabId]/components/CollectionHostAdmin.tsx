"use client";
import CreateCollectionHost from "@/modules/CreateCollectionHost";
import { useDaphneStore } from "@/store/useDaphneStore";
import { CollectionHost } from "@/types/api";
import { Box, Skeleton, Typography } from "@mui/material";
import CollectionHostsTable from "./CollectionHostsTable";
import Title from "@/components/Title";
import SwimLane from "@/components/SwimLane";
import SwimLaneContainer from "@/components/SwimLaneContainer";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import { useState, useMemo } from "react";
import Guidance from "./Guidance";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import CopyableVariable from "@/components/CopyableVariable";

const PANEL_WIDTH = 3;

const CollectionHostAdmin = ({
  pid,
  collectionHosts,
}: {
  pid: string;
  collectionHosts: CollectionHost[];
}) => {
  const {
    custodianData: { custodians },
  } = useDaphneStore();

  const [expandedLeft, setExpandedLeft] = useState(false);
  const createNewHost = () => setExpandedLeft(true);

  const custodian = custodians.find((c) => c.pid === pid);
  const noHosts = collectionHosts.length === 0;

  const leftSize = expandedLeft ? 12 - PANEL_WIDTH : PANEL_WIDTH;
  const middleSize = expandedLeft
    ? 0
    : noHosts
    ? 12 - PANEL_WIDTH
    : 12 - 2 * PANEL_WIDTH;

  const rightSize = noHosts && !expandedLeft ? 0 : PANEL_WIDTH;

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const selectedHostIds = useMemo(() => trueKeys(rowSelection), [rowSelection]);

  const selectedHost = useMemo(
    () =>
      selectedHostIds.length > 0
        ? collectionHosts.find((h) => h.client_id === selectedHostIds[0])
        : null,
    [collectionHosts, selectedHostIds]
  );

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
                  onCancel={() => setExpandedLeft(false)}
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
            <CollectionHostsTable
              collectionHosts={collectionHosts}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          )}
        </SwimLane>

        <SwimLane size={rightSize}>
          {selectedHost ? (
            <>
              <ActionMenuSection
                title={"Host"}
                fixedExpanded
                defaultExpanded
                underline
              >
                {selectedHost.name}
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
