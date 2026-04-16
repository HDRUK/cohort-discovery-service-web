"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateCollection from "@/modules/CreateCollection";
import { useCallback } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { CollectionFilterStatus } from "@/types/collections";
import { ThreePaneProvider, useThreePane } from "@/providers/ThreePaneProvider";

const CollectionsLeftPanel = () => {
  const { getSearchParam, setSearchParam } =
    useSearchParams("collection_filter");
  const searchParam = getSearchParam();

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

  const { expandedLeft, toggleLeft } = useThreePane();

  return (
    <ThreePaneProvider>
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
            onClick={toggleLeft}
            label={"Collection"}
            disabled={expandedLeft}
          />

          {expandedLeft && <CreateCollection onCancel={toggleLeft} />}
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
                selected:
                  searchParam === CollectionFilterStatus.ALL || !searchParam,
              },
              {
                label: "Draft Collections",
                onClick: () =>
                  onSelectCollectionsStatus(CollectionFilterStatus.DRAFT),
                selected: searchParam === CollectionFilterStatus.DRAFT,
              },
              {
                label: "Active Collections",
                onClick: () =>
                  onSelectCollectionsStatus(CollectionFilterStatus.ACTIVE),
                selected: searchParam === CollectionFilterStatus.ACTIVE,
              },
              {
                label: "Pending Collections",
                onClick: () =>
                  onSelectCollectionsStatus(CollectionFilterStatus.PENDING),
                selected: searchParam === CollectionFilterStatus.PENDING,
              },
              {
                label: "Offline Collections",
                onClick: () =>
                  onSelectCollectionsStatus(CollectionFilterStatus.SUSPENDED),
                selected: searchParam === CollectionFilterStatus.SUSPENDED,
              },
              {
                label: "Rejected Collections",
                onClick: () =>
                  onSelectCollectionsStatus(CollectionFilterStatus.REJECTED),
                selected: searchParam === CollectionFilterStatus.REJECTED,
              },
            ]}
          />
        </ActionMenuSection>
      </Box>
    </ThreePaneProvider>
  );
};

export default CollectionsLeftPanel;
