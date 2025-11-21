"use client";
import { Dispatch, SetStateAction } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { MRT_RowSelectionState } from "material-react-table";
import { CollectionHost } from "@/types/api";
import CollectionHostsTable from "./CollectionHostsTable";

type CollectionHostListPanelProps = {
  noCollectionHosts: boolean;
  collectionHosts: CollectionHost[];
  rowSelection: MRT_RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<MRT_RowSelectionState>>;
  onDeleteHost: () => void;
  hasSelection: boolean;
};

const CollectionHostListPanel = ({
  noCollectionHosts,
  collectionHosts,
  rowSelection,
  setRowSelection,
  onDeleteHost,
  hasSelection,
}: CollectionHostListPanelProps) => {
  if (noCollectionHosts) {
    return (
      <Box sx={{ mx: "auto", my: "auto" }}>
        <Typography variant="h5">
          Collection hosts will appear here when they are created
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
          <IconButton onClick={onDeleteHost}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>

      <CollectionHostsTable
        collectionHosts={collectionHosts}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </Box>
  );
};

export default CollectionHostListPanel;
