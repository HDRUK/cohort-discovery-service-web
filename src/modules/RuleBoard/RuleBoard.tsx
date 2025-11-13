"use client";

import { useEffect, useState, Fragment } from "react";
import { RuleBoardSkeleton } from "./RuleBoardSkeleton";

import Rule from "@/modules/Rule";
import { isOperator, isRuleGroup, isRuleLeaf } from "@/utils/rules";
import { Box } from "@mui/material";
import { RuleGroupType, RuleNodeType } from "@/types/rules";
import RuleGroup from "@/modules/RuleGroup";
import RuleOperator from "@/modules/RuleOperator";
import { useDroppable } from "@dnd-kit/core";
import React from "react";
import DropSpacer from "@/components/DropSpacer";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface RuleBoardProps {
  ruleGroup: RuleGroupType;
}

function renderRule(item: RuleNodeType, ruleGroupId: string) {
  if (isRuleLeaf(item)) {
    return <Rule key={item.id} rule={item} groupId={ruleGroupId} />;
  } else if (isRuleGroup(item)) {
    return <RuleGroup key={item.id} group={item} parentGroupId={ruleGroupId} />;
  } else if (isOperator(item)) {
    return <RuleOperator key={item.id} operator={item} groupId={ruleGroupId} />;
  }
}

const RuleBoard = ({ ruleGroup }: RuleBoardProps) => {
  const { rules, id } = ruleGroup;
  const { setNodeRef } = useDroppable({
    id,
    data: { type: "container", containerId: id },
  });

  const [hasMounted, setHasMounted] = useState(typeof window !== "undefined");

  useEffect(() => {
    const t = setTimeout(() => setHasMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!hasMounted) {
    return <RuleBoardSkeleton />;
  }

  return (
    <div ref={setNodeRef}>
      <Box display="flex" flexDirection="column" gap={0}>
        <DropSpacer id={`${id}::top`} position="top" groupId={id} />
        <SortableContext
          items={rules.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {rules.map((rule) => {
            return <Fragment key={rule.id}>{renderRule(rule, id)}</Fragment>;
          })}
        </SortableContext>
        <DropSpacer id={`${id}::bottom`} position="bottom" groupId={id} />
      </Box>
    </div>
  );
};

export default RuleBoard;
