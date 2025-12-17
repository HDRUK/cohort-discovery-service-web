"use client";

import { CollectionWithHosts, Paginated } from "@/types/api";
import CollectionsTable from "@/components/CollectionsTable";
import { Box, Typography } from "@mui/material";
import { capitaliseFirstLetter } from "@/utils/string";
import { useDaphneStore } from "@/store/useDaphneStore";

type WorkgroupsMiddlePanelProps = {
  collections: Paginated<CollectionWithHosts[]>;
};

const WorkgroupsMiddlePanel = ({ collections }: WorkgroupsMiddlePanelProps) => {
  const {
    adminData: { selectedWorkgroup },
  } = useDaphneStore();

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
            initialData={collections}
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
