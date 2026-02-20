"use client";

import { Box, Stack, Typography } from "@mui/material";
import useAdminStore from "@/hooks/useAdminStore";
import { useNotify } from "@/providers/NotifyProvider";
import CustodianTable from "@/components/CustodianTable";

const NetworksMiddlePanel = () => {
  const selectedNetwork = useAdminStore((s) => s.selectedNetwork);
  const removeCustodiansFromNetwork = useAdminStore(
    (s) => s.removeCustodiansFromNetwork,
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
            tableTitle={`${selectedNetwork?.name} Network`}
            tableSubTitle="Collections"
            handleDelete={async (ids: string[]) => {
              await removeCustodiansFromNetwork({
                custodian_ids: ids.map((id) => +id),
                id: selectedNetwork.id,
              });
              notify.success(
                `${ids.length} Custodian${
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
