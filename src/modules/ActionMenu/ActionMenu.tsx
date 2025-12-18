"use client";

import * as React from "react";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import Hierarchy from "../Hierarchy";
import useQueryBuilder from "@/store/useQueryBuilder";
import { Box } from "@mui/material";

const ActionMenu: React.FC = () => {
  const {
    queryBuilderJson,
    createNewGroup,
    createNewRule,
    createNewAgeFilter,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    createNewGroup: qb.createNewGroup,
    createNewRule: qb.createNewRule,
    createNewAgeFilter: qb.createNewAgeFilter,
  }));

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
        <AddButton action={createNewAgeFilter} label={"Add age filter"} />
        <AddButton action={createNewRule} label={"Add rule"} />
        <AddButton action={createNewGroup} label={"Add group"} />
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
