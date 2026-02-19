"use client";

import CollectionsTable from "@/components/CollectionsTable";
import { Box, Stack, Typography } from "@mui/material";
import { capitaliseFirstLetter } from "@/utils/string";
import useAdminStore from "@/hooks/useAdminStore";
import { useNotify } from "@/providers/NotifyProvider";
import CustodianTable from "@/components/CustodianTable";

const NetworksMiddlePanel = () => {
  const selectedNetwork = useAdminStore((s) => s.selectedNetwork);
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
      {!!selectedNetwork && (
        <Stack gap={2}>
          <CustodianTable
            tableTitle={`${capitaliseFirstLetter(
              selectedNetwork?.name.toLowerCase(),
            )} Workgroup`}
            tableSubTitle="Collections"
            deleteOverride={async (ids: string[]) => {
              /*await removeCollectionsFromWorkgroup({
                ids: ids.map((id) => +id),
                id: selectedNetwork.id,
              });*/
              notify.success(
                `${ids.length} Collection${
                  ids.length > 1 ? "s" : ""
                } removed from network ${selectedNetwork.name}`,
              );
            }}
            boxSxProps={{ minHeight: 300 }}
          />
        </Stack>
      )}
      {!selectedNetwork && (
        <Box sx={{ mx: "auto", my: "auto" }}>
          <Typography variant="h5">
            Collections will appear here when a network is selected
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NetworksMiddlePanel;
