"use client";

import * as React from "react";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Hierarchy from "../Hierarchy";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { Box } from "@mui/material";
import SkeletonFull from "@/components/SkeletonFull";
import useStateManagement from "@/hooks/useStateManagement";
import { useCohortBuilderContext } from "@/providers/CohortBuilderProvider";

const ActionMenu: React.FC = () => {
  const queryBuilderJson = useQueryBuilder((qb) => qb.queryBuilderJson);
  const { actions } = useCohortBuilderContext();

  const isLoading = useStateManagement((s) => s.isLoading);
  if (isLoading) {
    return <SkeletonFull />;
  }

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
      <ActionMenuSection
        title={"Insert"}
        shortTitle={<LibraryAddIcon />}
        defaultExpanded
        underline
      >
        {actions.map(({ action, label }) => (
          <AddButton key={label} onClick={action} label={label} />
        ))}
      </ActionMenuSection>
      <ActionMenuSection
        title={"Hierarchy"}
        defaultExpanded
        disabled={queryBuilderJson.rules.length === 0}
        underline
      >
        <Hierarchy />
      </ActionMenuSection>
    </Box>
  );
};

export default ActionMenu;
