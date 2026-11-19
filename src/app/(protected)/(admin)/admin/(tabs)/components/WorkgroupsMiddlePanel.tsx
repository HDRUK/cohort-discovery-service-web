"use client";

import { Suspense } from "react";
import CollectionsTable from "@/components/CollectionsTable";
import { Box, Stack, Typography } from "@mui/material";
import { formatWorkgroupName } from "@/utils/workgroups";
import { useNotify } from "@/providers/NotifyProvider";
import UserTable from "@/components/UserTable";
import { CollectionWithHosts, Paginated } from "@/types/api";
import removeCollectionsFromWorkgroup from "@/actions/workgroup/removeCollectionsFromWorkgroup";
import useSelectedWorkgroup from "@/hooks/useSelectedWorkgroup";
import WorkgroupUsers from "./WorkgroupUsers";

const WorkgroupsMiddlePanel = ({
  collections,
}: {
  collections?: Paginated<CollectionWithHosts>;
}) => {
  const selectedWorkgroup = useSelectedWorkgroup();

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
              collections={collections}
              tableTitle={`${formatWorkgroupName(selectedWorkgroup?.name)} Workgroup`}
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
          <Box>
            <Suspense
              fallback={
                <UserTable
                  tableTitle={`${formatWorkgroupName(selectedWorkgroup.name)} Workgroup`}
                  tableSubTitle="Users"
                  boxSxProps={{ minHeight: 300 }}
                />
              }
            >
              <WorkgroupUsers
                key={selectedWorkgroup.id}
                workgroup={selectedWorkgroup}
              />
            </Suspense>
          </Box>
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
