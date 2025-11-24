"use client";
import { Box } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollection from "@/modules/CreateCollection";
import { CollectionHost, Custodian } from "@/types/api";

type CollectionHostCreatePanelProps = {
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
}: CollectionHostCreatePanelProps) => {
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
        fixedExpanded
        defaultExpanded
        underline
      >
        <AddButton
          action={onCreate}
          label={"Collection"}
          disabled={expandedLeft}
        />
      </ActionMenuSection>

      {expandedLeft && (
        <CreateCollection
          custodian={custodian}
          collectionHosts={collectionHosts}
          onCancel={onCancelCreate}
        />
      )}
    </Box>
  );
};

export default CollectionsLeftPanel;
