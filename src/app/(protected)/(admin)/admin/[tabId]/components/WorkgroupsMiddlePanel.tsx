"use client";

import CollectionsTable from "@/components/CollectionsTable";
import { Box, Stack, Typography } from "@mui/material";
import { capitaliseFirstLetter } from "@/utils/string";
import useAdminStore from "@/hooks/useAdminStore";
import { useNotify } from "@/providers/NotifyProvider";
import UserTable from "@/components/UserTable";
import useFeatures from "@/hooks/useFeatures";

const WorkgroupsMiddlePanel = () => {
  const { manageWorkgroupsInternal } = useFeatures();

  const selectedWorkgroup = useAdminStore((s) => s.selectedWorkgroup);
  const removeCollectionsFromWorkgroup = useAdminStore(
    (s) => s.removeCollectionsFromWorkgroup,
  );

  const removeUsersFromWorkgroup = useAdminStore(
    (s) => s.removeUsersFromWorkgroup,
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
      {!!selectedWorkgroup && (
        <Stack gap={2}>
          <Box>
            <CollectionsTable
              tableTitle={`${capitaliseFirstLetter(
                selectedWorkgroup?.name.toLowerCase(),
              )} Workgroup`}
              tableSubTitle="Collections"
              deleteOverride={async (ids: string[]) => {
                await removeCollectionsFromWorkgroup({
                  ids: ids.map((id) => +id),
                  workgroup_id: selectedWorkgroup.id,
                });
                notify.success(
                  `${ids.length} Collection${
                    ids.length > 1 ? "s" : ""
                  } removed from workgroup ${selectedWorkgroup.name}`,
                );
              }}
              emptyMessageOverride="Workgroup collections will appear here when created or assigned"
              boxSxProps={{ minHeight: 300 }}
            />
          </Box>
          {manageWorkgroupsInternal && (
            <Box>
              <UserTable
                tableTitle={`${capitaliseFirstLetter(
                  selectedWorkgroup?.name.toLowerCase(),
                )} Workgroup`}
                tableSubTitle="Users"
                handleDelete={async (ids: string[]) => {
                  await removeUsersFromWorkgroup({
                    ids: ids.map((id) => +id),
                    workgroup_id: selectedWorkgroup.id,
                  });
                  notify.success(
                    `${ids.length} Users${
                      ids.length > 1 ? "s" : ""
                    } removed from workgroup ${selectedWorkgroup.name}`,
                  );
                }}
                boxSxProps={{ minHeight: 300 }}
              />
            </Box>
          )}
        </Stack>
      )}
      {!selectedWorkgroup && (
        <Box sx={{ mx: "auto", my: "auto" }}>
          <Typography variant="h5">
            Workgroup collections will appear here when a workgroup is selected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WorkgroupsMiddlePanel;
