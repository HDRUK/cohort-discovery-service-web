"use client";

import { Box, Stack } from "@mui/material";
import { Custodian, Paginated } from "@/types/api";
import { useNotify } from "@/providers/NotifyProvider";
import { useConfirm } from "@/hooks/useConfirm";
import CustodianTable from "@/components/CustodianTable";
import removeCustodiansFromNetwork from "@/actions/network/removeCustodiansFromNetwork";
import useSelectedNetwork from "@/hooks/useSelectedNetwork";

const NetworksMiddlePanel = ({
  custodians,
}: {
  custodians?: Paginated<Custodian>;
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
      <Stack gap={2}>
        <CustodianTable
          custodians={custodians}
          tableTitle={
            selectedNetwork ? `${selectedNetwork.name} network` : "Network"
          }
          tableSubTitle="Custodians"
          onDelete={removeCustodians}
          emptyMessage={
            selectedNetwork
              ? "Custodians will appear here when they are added to this network, or when one matches your search"
              : "Network custodians will appear here when a network is created"
          }
          boxSxProps={{ minHeight: 300 }}
        />
      </Stack>
    </Box>
  );
};

export default NetworksMiddlePanel;
