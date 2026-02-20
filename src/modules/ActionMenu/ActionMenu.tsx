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

const ActionMenu: React.FC = () => {
  const {
    queryBuilderJson,
    createNewGroup,
    createNewRule,
    createNewAgeFilter,
    createNewOperator,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    createNewGroup: qb.createNewGroup,
    createNewRule: qb.createNewRule,
    createNewAgeFilter: qb.createNewAgeFilter,
    createNewOperator: qb.createNewOperator,
  }));

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
        <AddButton onClick={createNewAgeFilter} label={"Add age filter"} />
        <AddButton onClick={createNewRule} label={"Add rule"} />
        <AddButton onClick={createNewGroup} label={"Add group"} />
        <AddButton onClick={createNewOperator} label={"Add operator"} />
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
