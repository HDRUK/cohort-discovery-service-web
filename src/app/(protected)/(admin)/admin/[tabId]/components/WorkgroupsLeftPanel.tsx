"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateWorkgroup from "@/modules/CreateWorkgroup";
import { Collection, Workgroup } from "@/types/api";
import { Dispatch, SetStateAction, useCallback } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { capitaliseFirstLetter } from "@/utils/string";

type WorkgroupsLeftPanelProps = {
  workgroups: Workgroup[];
  collections: Collection[];
  expandedLeft: boolean;
  onCreate: () => void;
  onCancelCreate: () => void;
  setSelectedWorkgroupId: Dispatch<SetStateAction<number | undefined>>;
};

const WorkgroupsLeftPanel = ({
  workgroups,
  collections,
  expandedLeft,
  onCreate,
  onCancelCreate,
  setSelectedWorkgroupId,
}: WorkgroupsLeftPanelProps) => {
  const { setSearchParam } = useSearchParams("workgroup_filter");

  const onSelectWorkgroup = useCallback(
    (id?: number) => {
      if (!id) {
        setSelectedWorkgroupId(undefined);
        setSearchParam(null);
        return;
      }
      setSelectedWorkgroupId(id);
      setSearchParam(id.toString());
    },
    [setSearchParam]
  );

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
          action={onCreate}
          label={"Workgroup"}
          disabled={expandedLeft}
        />

        {expandedLeft && (
          <CreateWorkgroup
            collections={collections}
            onCancel={onCancelCreate}
          />
        )}
      </ActionMenuSection>

      <ActionMenuSection
        hidden={expandedLeft}
        title={"Manage"}
        defaultExpanded
        underline
      >
        <List
          items={workgroups.map((workgroup, idx) => ({
            label: capitaliseFirstLetter(workgroup.name.toLowerCase()),
            onClick: () => onSelectWorkgroup(idx + 1),
          }))}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default WorkgroupsLeftPanel;
