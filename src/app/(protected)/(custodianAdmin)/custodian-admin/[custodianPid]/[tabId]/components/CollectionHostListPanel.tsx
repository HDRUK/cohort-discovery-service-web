"use client";
import { Dispatch, SetStateAction } from "react";
import { Box, Typography } from "@mui/material";
import { MRT_RowSelectionState } from "material-react-table";
import { CollectionHost } from "@/types/api";
import CollectionHostsTable from "./CollectionHostsTable";

type CollectionHostListPanelProps = {
  noCollectionHosts: boolean;
  collectionHosts: CollectionHost[];
  rowSelection: MRT_RowSelectionState;
  setRowSelection: Dispatch<SetStateAction<MRT_RowSelectionState>>;
  onDeleteHost: () => void;
};

const CollectionHostListPanel = ({
  noCollectionHosts,
  collectionHosts,
  rowSelection,
  setRowSelection,
  onDeleteHost,
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
      <CollectionHostsTable
        collectionHosts={collectionHosts}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onDelete={onDeleteHost}
      />
    </Box>
  );
};

export default CollectionHostListPanel;
