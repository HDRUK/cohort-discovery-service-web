"use client";
import { Box } from "@mui/material";
import List from "@/components/List";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import CreateWorkgroup from "@/modules/CreateWorkgroup";
import {
  Collection,
  CollectionWithHosts,
  Custodian,
  Workgroup,
} from "@/types/api";
import { useCallback, useMemo, useState } from "react";
import useSearchParams from "@/hooks/useSearchParams";
import { CollectionFilterStatus } from "@/types/collections";
import { useDaphneStore } from "@/store/useDaphneStore";
import { MRT_RowSelectionState } from "material-react-table";
import { trueKeys } from "@/utils/numbers";
import { capitaliseFirstLetter } from "@/utils/string";

type WorkgroupsLeftPanelProps = {
  collections: CollectionWithHosts[];
  workgroups: Workgroup[];
  custodians: Custodian[];
  expandedLeft: boolean;
  expandedRight: boolean;
  onCreate: () => void;
  onCancelCreate: () => void;
  setSelectedWorkgroupId;
};

const WorkgroupsLeftPanel = ({
  collections,
  workgroups,
  custodians,
  expandedLeft,
  expandedRight,
  onCreate,
  onCancelCreate,
  setSelectedWorkgroupId,
}: // setSearchParam,
WorkgroupsLeftPanelProps) => {
  const { setSearchParam } = useSearchParams("workgroup_filter");
  // const {
  //   adminData: { currentWorkgroup, setCurrentWorkgroup },
  // } = useDaphneStore();

  // useEffect(() => {
  //   setCurrentWorkgroup(workgroup);
  // }, [workgroup, setCurrentWorkgroup]);

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
          <CreateWorkgroup custodians={custodians} onCancel={onCancelCreate} />
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
