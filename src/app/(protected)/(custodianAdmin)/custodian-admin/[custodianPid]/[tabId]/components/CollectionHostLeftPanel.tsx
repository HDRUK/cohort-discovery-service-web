"use client";
import { Box } from "@mui/material";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollectionHost from "@/modules/CreateCollectionHost";
import { useThreePane } from "@/providers/ThreePaneProvider";
import List from "@/components/List";
import useSearchParams from "@/hooks/useSearchParams";
import { CollectionHostFilter } from "@/types/collections";

type CollectionHostLeftPanelProps = {
  custodianId: number;
};

const CollectionHostLeftPanel = ({
  custodianId,
}: CollectionHostLeftPanelProps) => {
  const { expandedLeft, toggleLeft } = useThreePane();

  const { getSearchParam, setSearchParam } = useSearchParams(
    "collection_host_filter",
  );
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
              onClick: () => setSearchParam(CollectionHostFilter.ALL),
              selected:
                searchParam === CollectionHostFilter.ALL || !searchParam,
            },
            {
              label: "Deleted Hosts",
              onClick: () => setSearchParam(CollectionHostFilter.DELETED),
              selected: searchParam === CollectionHostFilter.DELETED,
            },
          ]}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default CollectionHostLeftPanel;
