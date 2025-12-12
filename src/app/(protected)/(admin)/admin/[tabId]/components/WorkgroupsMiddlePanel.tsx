"use client";

import { CollectionWithHosts, Paginated, Workgroup } from "@/types/api";
import { MRT_RowSelectionState } from "material-react-table";
import { Dispatch, SetStateAction } from "react";
import CollectionsTable from "@/components/CollectionsTable";
import { Box, Typography } from "@mui/material";
import { capitaliseFirstLetter } from "@/utils/string";

type WorkgroupsMiddlePanelProps = {
  collections: Paginated<CollectionWithHosts[]>;
  expandedLeft: boolean;
  expandedRight: boolean;
  selectedWorkgroup?: Workgroup;
  rowSelection?: MRT_RowSelectionState;
  setRowSelection?: Dispatch<SetStateAction<MRT_RowSelectionState>>;
};

const WorkgroupsMiddlePanel = ({
  collections,
  expandedLeft,
  expandedRight,
  selectedWorkgroup,
  rowSelection,
  setRowSelection,
}: WorkgroupsMiddlePanelProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      {
        !!selectedWorkgroup && (
          <CollectionsTable
            collections={collections}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            tableTitle={`${capitaliseFirstLetter(
              selectedWorkgroup?.name.toLowerCase()
            )} Workgroups`}
            tableSubTitle="Collections"
          />
        )
        //* Space here for Users Table post MVP
      }
      {!selectedWorkgroup && (
        <Box sx={{ mx: "auto", my: "auto" }}>
          <Typography variant="h5">
            Collections will appear here when a workgroup is selected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WorkgroupsMiddlePanel;
