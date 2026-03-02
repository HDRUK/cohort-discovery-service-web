"use client";
import { Box } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollectionHost from "@/modules/CreateCollectionHost";
import { useThreePane } from "@/providers/ThreePaneProvider";

type CollectionHostLeftPanelProps = {
  custodianId: number;
};

const CollectionHostLeftPanel = ({
  custodianId,
}: CollectionHostLeftPanelProps) => {
  const { expandedLeft, toggleLeft } = useThreePane();

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
          onClick={toggleLeft}
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
            onCancel={toggleLeft}
          />
        </ActionMenuSection>
      )}
    </Box>
  );
};

export default CollectionHostLeftPanel;
