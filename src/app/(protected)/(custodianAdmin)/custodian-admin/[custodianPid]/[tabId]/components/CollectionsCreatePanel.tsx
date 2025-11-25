"use client";
import { Box } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollection from "@/modules/CreateCollection";
import { CollectionHost, Custodian } from "@/types/api";

type CollectionsCreatePanelProps = {
  custodian: Custodian;
  collectionHosts: CollectionHost[];
  expandedLeft: boolean;
  onCreate: () => void;
  onCancelCreate: () => void;
};

const CollectionsCreatePanel = ({
  custodian,
  collectionHosts,
  expandedLeft,
  onCreate,
  onCancelCreate,
}: CollectionsCreatePanelProps) => {
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

export default CollectionsCreatePanel;
