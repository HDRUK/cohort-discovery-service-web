"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateWorkgroup from "@/modules/CreateWorkgroup";
import { useCallback, useEffect } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import useAdminStore from "@/hooks/useAdminStore";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { useUserDataStore } from "@/hooks/userDataStore";
import { formatWorkgroupName } from "@/utils/workgroups";

const WorkgroupsLeftPanel = () => {
  const { expandedLeft, toggleLeft } = useThreePane();

  const selectedWorkgroup = useAdminStore((s) => s.selectedWorkgroup);
  const setSelectedWorkgroup = useAdminStore((s) => s.setSelectedWorkgroup);
  const workgroups = useUserDataStore((s) => s.workgroups);

  const { getSearchParam, setSearchParam } =
    useSearchParams("workgroup_filter");

  const workgroupId = getSearchParam();

  useEffect(() => {
    const workgroup = workgroups.find((w) => String(w.id) === workgroupId);
    setSelectedWorkgroup(workgroup ?? null);
  }, [workgroups, workgroupId, setSelectedWorkgroup]);

  const onSelectWorkgroup = useCallback(
    (id?: number) => {
      if (!id) {
        setSearchParam(null);
        return;
      }
      setSearchParam(String(id));
    },
    [setSearchParam],
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
          onClick={toggleLeft}
          label={"Workgroup"}
          disabled={expandedLeft}
        />

        {expandedLeft && <CreateWorkgroup onCancel={toggleLeft} />}
      </ActionMenuSection>

      <ActionMenuSection
        hidden={expandedLeft}
        title={"Manage"}
        defaultExpanded
        underline
      >
        <List
          items={workgroups.map((workgroup) => ({
            label: formatWorkgroupName(workgroup.name), //capitaliseFirstLetter(workgroup.name.toLowerCase()),
            onClick: () => onSelectWorkgroup(workgroup.id),
            selected: selectedWorkgroup?.id === workgroup.id,
          }))}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default WorkgroupsLeftPanel;
