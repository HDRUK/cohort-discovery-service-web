"use client";
import { Box } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollectionHost from "@/modules/CreateCollectionHost";
import { useThreePane } from "@/providers/ThreePaneProvider";
import List from "@/components/List";
import useSearchParams from "@/hooks/useSearchParams";

type CollectionHostLeftPanelProps = {
  custodianId: number;
};

const CollectionHostLeftPanel = ({
  custodianId,
}: CollectionHostLeftPanelProps) => {
  const { expandedLeft, toggleLeft } = useThreePane();

  //does nothing yet
  // - here for the future if a host filter is to be implemented
  const { getSearchParam } = useSearchParams("collection_host_filter");
  const searchParam = getSearchParam();

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

      <ActionMenuSection
        hidden={expandedLeft}
        title={"Manage"}
        defaultExpanded
        underline
      >
        <List
          items={[
            {
              label: "All Hosts",
              onClick: () => ({}),
              selected: !searchParam,
            },
          ]}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default CollectionHostLeftPanel;
