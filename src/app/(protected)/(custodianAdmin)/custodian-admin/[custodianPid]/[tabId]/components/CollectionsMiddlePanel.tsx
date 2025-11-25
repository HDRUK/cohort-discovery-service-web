"use client";
import { Box } from "@mui/material";
import { CollectionWithHosts, Paginated } from "@/types/api";
import CollectionsTable from "@/components/CollectionsTable";

type CollectionHostCreatePanelProps = {
  expandedLeft: boolean;
  collections: Paginated<CollectionWithHosts[]>;
};

const CollectionsMiddlePanel = ({
  collections,
  expandedLeft,
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
      <CollectionsTable collections={collections} />
    </Box>
  );
};

export default CollectionsMiddlePanel;

// description and link to associated datasets other way around
// frequency stays open
// hide sychronisation time
