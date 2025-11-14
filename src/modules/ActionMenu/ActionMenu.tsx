"use client";

import * as React from "react";
import ActionMenuSection from "@/components/ActionMenuSection";
import AddButton from "@/components/AddButton";
import Hierarchy from "../Hierarchy";
import useQueryBuilder from "@/store/useQueryBuilder";

const ActionMenu: React.FC = () => {
  const { queryBuilderJson, createNewGroup, createNewRule } = useQueryBuilder(
    (qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      createNewGroup: qb.createNewGroup,
      createNewRule: qb.createNewRule,
    })
  );

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
