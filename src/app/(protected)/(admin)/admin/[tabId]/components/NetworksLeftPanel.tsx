"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import { useCallback, useEffect } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import useAdminStore from "@/hooks/useAdminStore";
import CreateNetwork from "@/modules/CreateNetwork";
import { useConfirm } from "@/hooks/useConfirm";

type NetworksLeftPanelProps = {
  expandedLeft: boolean;
  onCreate: () => void;
  onCancelCreate: () => void;
};

const NetworksLeftPanel = ({
  expandedLeft,
  onCreate,
  onCancelCreate,
}: NetworksLeftPanelProps) => {
  const selectedNetwork = useAdminStore((s) => s.selectedNetwork);
  const setSelectedNetwork = useAdminStore((s) => s.setSelectedNetwork);
  const networks = useAdminStore((s) => s.networks);
  const deleteNetwork = useAdminStore((s) => s.deleteNetwork);

  const { getSearchParam, setSearchParam } = useSearchParams("network_filter");

  const workgroupId = getSearchParam();

  useEffect(() => {
    const network = networks.find((w) => String(w.id) === workgroupId);
    setSelectedNetwork(network ?? null);
  }, [networks, workgroupId, setSelectedNetwork]);

  const onSelectNetwork = useCallback(
    (id?: number) => {
      if (!id) {
        setSearchParam(null);
        return;
      }
      setSearchParam(String(id));
    },
    [setSearchParam],
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
          onClick={onCreate}
          label={"Network"}
          disabled={expandedLeft}
        />

        {expandedLeft && (
          <CreateNetwork onCreate={onSelectNetwork} onCancel={onCancelCreate} />
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
                  if (ok) {
                    deleteNetwork(network.id);
                  }
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
