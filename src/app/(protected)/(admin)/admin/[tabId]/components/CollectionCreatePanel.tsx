"use client";
import { Box } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollection from "@/modules/CreateCollection";

type CollectionCreatePanelProps = {
  //   custodianId: number;
  expandedLeft: boolean;
  onCreateNewHost: () => void;
  onCancelCreate: () => void;
};

const CollectionCreatePanel = ({
  //   custodianId,
  expandedLeft,
  onCreateNewHost,
  onCancelCreate,
}: CollectionCreatePanelProps) => {
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
          label={"Collection"}
          disabled={expandedLeft}
        />
      </ActionMenuSection>

      {expandedLeft && (
        <ActionMenuSection
          title={"New Collection"}
          fixedExpanded
          defaultExpanded
          underline
          scrollable
        >
          <CreateCollection
            custodian={[]}
            collectionHosts={[]}
            onCancel={onCancelCreate}
          />
        </ActionMenuSection>
      )}
    </Box>
  );
};

export default CollectionCreatePanel;
