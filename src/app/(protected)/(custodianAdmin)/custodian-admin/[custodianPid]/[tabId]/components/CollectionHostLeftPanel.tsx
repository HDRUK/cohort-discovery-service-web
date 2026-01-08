"use client";
import { Box } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollectionHost from "@/modules/CreateCollectionHost";

type CollectionHostLeftPanelProps = {
  custodianId: number;
  expandedLeft: boolean;
  onCreateNewHost: () => void;
  onCancelCreate: () => void;
};

const CollectionHostLeftPanel = ({
  custodianId,
  expandedLeft,
  onCreateNewHost,
  onCancelCreate,
}: CollectionHostLeftPanelProps) => {
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
          action={onCreateNewHost}
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
            custodianId={custodianId}
            onCancel={onCancelCreate}
          />
        </ActionMenuSection>
      )}
    </Box>
  );
};

export default CollectionHostLeftPanel;
