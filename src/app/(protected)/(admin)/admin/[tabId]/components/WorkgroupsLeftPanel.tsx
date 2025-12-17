"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateWorkgroup from "@/modules/CreateWorkgroup";
import { Collection, Workgroup } from "@/types/api";
import { useCallback } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { capitaliseFirstLetter } from "@/utils/string";
import { useDaphneStore } from "@/store/useDaphneStore";

type WorkgroupsLeftPanelProps = {
  workgroups: Workgroup[];
  collections: Collection[];
  expandedLeft: boolean;
  onCreate: () => void;
  onCancelCreate: () => void;
};

const WorkgroupsLeftPanel = ({
  workgroups,
  collections,
  expandedLeft,
  onCreate,
  onCancelCreate,
}: WorkgroupsLeftPanelProps) => {
  const {
    adminData: { setSelectedWorkgroup },
  } = useDaphneStore();
  const { setSearchParam } = useSearchParams("workgroup_filter");

  const onSelectWorkgroup = useCallback(
    (workgroup?: Workgroup) => {
      if (!workgroup) {
        setSelectedWorkgroup(null);
        setSearchParam(null);
        return;
      }
      setSelectedWorkgroup(workgroup);
      setSearchParam(workgroup.id.toString());
    },
    [setSelectedWorkgroup, setSearchParam]
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
          items={workgroups.map((workgroup) => ({
            label: capitaliseFirstLetter(workgroup.name.toLowerCase()),
            onClick: () => onSelectWorkgroup(workgroup),
          }))}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default WorkgroupsLeftPanel;
