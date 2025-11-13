"use client";

import * as React from "react";
import { useDaphneStore } from "@/store/useDaphneStore";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import Hierarchy from "../Hierarchy";

const ActionMenu: React.FC = () => {
  const {
    queryBuilder: { queryBuilderJson, createNewGroup, createNewRule },
  } = useDaphneStore();

  return (
    <>
      <ActionMenuSection title={"Insert"} defaultExpanded underline>
        <AddButton action={createNewRule} label={"Add rule"} />
        <AddButton action={createNewGroup} label={"Add group"} />
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
