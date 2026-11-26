"use client";
import { Box, Skeleton } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateWorkgroup from "@/modules/CreateWorkgroup";
import { useCallback, Suspense } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { useThreePane } from "@/providers/ThreePaneProvider";
import { formatWorkgroupName } from "@/utils/workgroups";
import { useSessionData } from "@/contexts/SessionDataContext";
import useSelectedWorkgroup from "@/hooks/useSelectedWorkgroup";

const WorkgroupsLeftPanel = () => {
  const { expandedLeft, toggleLeft } = useThreePane();

  const selectedWorkgroup = useSelectedWorkgroup();
  const workgroups = useSessionData().workgroups;

  const { setSearchParam } =
    useSearchParams("workgroup_filter");


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

        {expandedLeft && (
          <Suspense fallback={<Skeleton variant="rectangular" height={300} />}>
            <CreateWorkgroup onCancel={toggleLeft} />
          </Suspense>
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
            label: formatWorkgroupName(workgroup.name),
            onClick: () => onSelectWorkgroup(workgroup.id),
            selected: selectedWorkgroup?.id === workgroup.id,
          }))}
        />
      </ActionMenuSection>
    </Box>
  );
};

export default WorkgroupsLeftPanel;
