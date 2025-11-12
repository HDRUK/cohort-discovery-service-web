"use client";

import * as React from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ActionMenuSection from "@/components/ActionMenuSection";
import Hierarchy from "../Hierarchy";

const ActionMenu: React.FC = () => {
  const {
    queryBuilder: { queryBuilderJson, createNewGroup, createNewRule },
  } = useDaphneStore();

  return (
    <>
      <ActionMenuSection title={"Insert"} defaultExpanded>
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => createNewRule()}
          sx={{ justifyContent: "flex-start", color: "text.primary" }}
        >
          Add rule
        </Button>

        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => createNewGroup()}
          sx={{ justifyContent: "flex-start", color: "text.primary" }}
        >
          Add group
        </Button>
      </ActionMenuSection>
      <ActionMenuSection
        title={"Hierarchy"}
        defaultExpanded={queryBuilderJson.rules.length > 0}
        disabled={queryBuilderJson.rules.length === 0}
        underline
      >
        <Hierarchy />
      </ActionMenuSection>
    </>
  );
};

export default ActionMenu;
