"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollection from "@/modules/CreateCollection";
import { useCallback } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { CollectionFilterStatus } from "@/types/collections";

type CollectionsCreatePanelProps = {
  expandedLeft: boolean;
  onCreate: () => void;
  onCancelCreate: () => void;
};

const CollectionsLeftPanel = ({
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
    [setSearchParam],
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
      <ActionMenuSection
        title={"Create"}
        defaultExpanded
        underline
        fixedExpanded={expandedLeft}
      >
        <AddButton
          onClick={onCreate}
          label={"Collection"}
          disabled={expandedLeft}
        />

        {expandedLeft && <CreateCollection onCancel={onCancelCreate} />}
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
              onClick: () =>
                onSelectCollectionsStatus(CollectionFilterStatus.ALL),
            },
            {
              label: "Draft Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionFilterStatus.DRAFT),
            },
            {
              label: "Active Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionFilterStatus.ACTIVE),
            },
            {
              label: "Pending Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionFilterStatus.PENDING),
            },
            {
              label: "Suspended Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionFilterStatus.SUSPENDED),
            },
            {
              label: "Rejected Collections",
              onClick: () =>
                onSelectCollectionsStatus(CollectionFilterStatus.REJECTED),
            },
          ]}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default CollectionsLeftPanel;
