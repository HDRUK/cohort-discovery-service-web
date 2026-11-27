"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import { useCallback } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import CreateNetwork from "@/modules/CreateNetwork";
import { useConfirm } from "@/hooks/useConfirm";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { useNetworks } from "@/contexts/NetworksContext";
import deleteNetwork from "@/actions/network/deleteNetwork";
import useSelectedNetwork from "@/hooks/useSelectedNetwork";

const NetworksLeftPanel = () => {
  const { expandedLeft, toggleLeft } = useThreePane();

  const selectedNetwork = useSelectedNetwork();
  const networks = useNetworks();

  const { setSearchParams } = useSearchParams();


  const onSelectNetwork = useCallback(
    (id?: number) => {
      setSearchParams({
        network_filter: id ? String(id) : null,
        page: null,
        search_term: null,
      });
    },
    [setSearchParams],
  );

  const confirm = useConfirm();

  return (
    <Box
      sx={{
        px: 1,
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: 0,
      }}
    >
      <ActionMenuSection title={"Create"} defaultExpanded underline>
        <AddButton
          onClick={toggleLeft}
          label={"Network"}
          disabled={expandedLeft}
        />

        {expandedLeft && (
          <CreateNetwork onCreate={onSelectNetwork} onCancel={toggleLeft} />
        )}
      </ActionMenuSection>

      <ActionMenuSection
        hidden={expandedLeft}
        title={"Manage"}
        defaultExpanded
        underline
      >
        <List
          items={networks.map((network) => ({
            selected: selectedNetwork?.id === network.id,
            id: network.id,
            label: network?.name,
            onClick: () => onSelectNetwork(network.id),
            rightClickActions: [
              {
                label: "Delete",
                action: async () => {
                  const ok = await confirm({
                    props: { action: `delete the network ${network.name}` },
                    confirmText: "Delete",
                    confirmColor: "error",
                  });
                  if (!ok || ok === "cancel") {
                    return;
                  }
                  await deleteNetwork(network.id);
                },
              },
            ],
          }))}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default NetworksLeftPanel;
