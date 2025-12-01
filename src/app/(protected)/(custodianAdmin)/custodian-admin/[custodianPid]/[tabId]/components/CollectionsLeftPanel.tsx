"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollection from "@/modules/CreateCollection";
import { CollectionHost, Custodian } from "@/types/api";
import { useCallback } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { CollectionStatus } from "@/types/collections";

type CollectionsCreatePanelProps = {
  custodian: Custodian;
  collectionHosts: CollectionHost[];
  expandedLeft: boolean;
  onCreate: () => void;
  onCancelCreate: () => void;
};

const CollectionsLeftPanel = ({
  custodian,
  collectionHosts,
  expandedLeft,
  onCreate,
  onCancelCreate,
}: CollectionsCreatePanelProps) => {
  const { setSearchParam } = useSearchParams("collection_filter");

  const onSelectCollectionsStatus = useCallback(
    (status?: string) => {
      if (!status) {
        setSearchParam(null);
        return;
      }
      setSearchParam(status);
    },
    [setSearchParam]
  );

  return (
    <Box
      sx={{
        px: 1,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <ActionMenuSection title={"Create"} defaultExpanded underline>
        <AddButton
          action={onCreate}
          label={"Collection"}
          disabled={expandedLeft}
        />

        {expandedLeft && (
          <CreateCollection
            custodian={custodian}
            collectionHosts={collectionHosts}
            onCancel={onCancelCreate}
          />
        )}
      </ActionMenuSection>

      <ActionMenuSection
        hidden={expandedLeft}
        title={"Manage"}
        defaultExpanded
        underline
      >
        <List
          items={[
            {
              label: "All Collections",
              onClick: () => onSelectCollectionsStatus(CollectionStatus.ALL),
            },
            {
              label: "Draft Collections",
              onClick: () => onSelectCollectionsStatus(CollectionStatus.DRAFT),
            },
            {
              label: "Active Collections",
              onClick: () => onSelectCollectionsStatus(CollectionStatus.ACTIVE),
            },
            {
              label: "Pending Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionStatus.PENDING),
            },
            {
              label: "Suspended Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionStatus.SUSPENDED),
            },
            {
              label: "Host Active Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionStatus.HOST_ACTIVE),
            },
            {
              label: "Host Failed Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionStatus.HOST_FAILED),
            },
          ]}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default CollectionsLeftPanel;
