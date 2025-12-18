"use client";

import { CollectionWithHosts, Paginated } from "@/types/api";
import CollectionsTable from "@/components/CollectionsTable";
import { Box, Typography } from "@mui/material";
import { capitaliseFirstLetter } from "@/utils/string";
import useAdminStore from "@/store/useAdminStore";
import { useNotify } from "@/providers/NotifyProvider";

type WorkgroupsMiddlePanelProps = {
  collections: Paginated<CollectionWithHosts[]>;
};

const WorkgroupsMiddlePanel = ({ collections }: WorkgroupsMiddlePanelProps) => {
  const selectedWorkgroup = useAdminStore((s) => s.selectedWorkgroup);
  const removeCollectionsFromWorkgroup = useAdminStore(
    (s) => s.removeCollectionsFromWorkgroup
  );

  const notify = useNotify();

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
              await removeCollectionsFromWorkgroup({
                ids: ids.map((id) => +id),
                workgroup_id: selectedWorkgroup.id,
              });
              notify.success(
                `${ids.length} Collection${
                  ids.length > 1 ? "s" : ""
                } removed from workgroup ${selectedWorkgroup.name}`
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
