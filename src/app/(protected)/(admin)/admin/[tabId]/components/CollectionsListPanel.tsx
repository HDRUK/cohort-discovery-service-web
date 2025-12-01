"use client";
import { Dispatch, SetStateAction } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { MRT_RowSelectionState } from "material-react-table";
import { CollectionWithHosts, Paginated } from "@/types/api";
import CollectionTable from "./CollectionTable";

type CollectionsListPanelProps = {
  noCollections: boolean;
  collections: Paginated<CollectionWithHosts[]>;
  rowSelection: MRT_RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<MRT_RowSelectionState>>;
  onDeleteCollection: () => void;
  hasSelection: boolean;
};

const CollectionsListPanel = ({
  noCollections,
  collections,
  rowSelection,
  setRowSelection,
  onDeleteCollection,
  hasSelection,
}: CollectionsListPanelProps) => {
  if (noCollections) {
    return (
      <Box sx={{ mx: "auto", my: "auto" }}>
        <Typography variant="h5">
          Collections will appear here when they are created
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          minHeight: 40,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div></div>
        {hasSelection && (
          <IconButton onClick={onDeleteCollection}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <CollectionTable
        collections={collections}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </Box>
  );
};

export default CollectionsListPanel;
