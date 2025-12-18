"use client";

import { CollectionWithHosts, Paginated } from "@/types/api";
import CollectionsTable from "@/components/CollectionsTable";
import { Box, Typography } from "@mui/material";
import { capitaliseFirstLetter } from "@/utils/string";
import useAdminStore from "@/store/useAdminStore";

type WorkgroupsMiddlePanelProps = {
  collections: Paginated<CollectionWithHosts[]>;
};

const WorkgroupsMiddlePanel = ({ collections }: WorkgroupsMiddlePanelProps) => {
  const selectedWorkgroup = useAdminStore((s) => s.selectedWorkgroup);
  const removeCollectionFromWorkgroup = useAdminStore(
    (s) => s.removeCollectionFromWorkgroup
  );

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
            deleteOverride={async (ids: string[]) => {
              await Promise.all(
                ids.map(
                  async (id) =>
                    await removeCollectionFromWorkgroup({
                      id: +id,
                      workgroup_id: selectedWorkgroup.id,
                    })
                )
              );
            }}
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
