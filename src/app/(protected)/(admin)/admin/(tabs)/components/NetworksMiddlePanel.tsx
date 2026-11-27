"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Custodian, Paginated } from "@/types/api";
import { useNotify } from "@/providers/NotifyProvider";
import { useConfirm } from "@/hooks/useConfirm";
import CustodianTable from "@/components/CustodianTable";
import removeCustodiansFromNetwork from "@/actions/network/removeCustodiansFromNetwork";
import useSelectedNetwork from "@/hooks/useSelectedNetwork";

const NetworksMiddlePanel = ({
  custodians,
  isLoading,
}: {
  custodians?: Paginated<Custodian>;
  isLoading: boolean;
}) => {
  const selectedNetwork = useSelectedNetwork();

  const notify = useNotify();
  const confirm = useConfirm();

  const removeCustodians = async (ids: string[]): Promise<boolean> => {
    if (!selectedNetwork) return false;

    const plural = ids.length > 1 ? "s" : "";
    const ok = await confirm({
      props: {
        action: `remove ${ids.length} custodian${plural} from the network ${selectedNetwork.name}`,
      },
      confirmText: "Remove",
      confirmColor: "error",
    });
    if (!ok || ok === "cancel") return false;

    await removeCustodiansFromNetwork({
      custodian_ids: ids.map((id) => +id),
      id: selectedNetwork.id,
    });
    notify.success(
      `${ids.length} custodian${plural} removed from network ${selectedNetwork.name}`,
    );
    return true;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      {(isLoading || !!selectedNetwork) && (
        <Stack gap={2}>
          <CustodianTable
            custodians={custodians}
            tableTitle={
              selectedNetwork ? `${selectedNetwork.name} network` : "Network"
            }
            tableSubTitle="Custodians"
            onDelete={removeCustodians}
            emptyMessage="Custodians will appear here when they are added to this network, or when one matches your search"
            boxSxProps={{ minHeight: 300 }}
          />
        </Stack>
      )}
      {!isLoading && !selectedNetwork && (
        <Box sx={{ mx: "auto", my: "auto" }}>
          <Typography variant="h5">
            Create a network to see its custodians here
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NetworksMiddlePanel;
