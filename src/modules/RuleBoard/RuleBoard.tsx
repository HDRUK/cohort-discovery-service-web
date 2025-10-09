"use client";

import { useEffect, useState, useMemo, Fragment } from "react";
import { RuleBoardSkeleton } from "./RuleBoardSkeleton";

import Rule from "@/modules/Rule";
import { isOperator, isRuleGroup, isRuleLeaf } from "@/utils/rules";
import { Alert, Box } from "@mui/material";
import { RuleGroupType, RuleNodeType } from "@/types/rules";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import RuleGroup from "@/modules/RuleGroup";
import { useDaphneStore } from "@/store/useDaphneStore";
import RuleOperator from "../RuleOperator";
import { useDroppable } from "@dnd-kit/core";
import React from "react";
import DropSpacer from "./DropSpacer";

interface RuleBoardProps {
  ruleGroup: RuleGroupType;
}

function renderRule(item: RuleNodeType) {
  if (isRuleLeaf(item)) {
    return <Rule sortable key={item.id} rule={item} />;
  } else if (isRuleGroup(item)) {
    return <RuleGroup sortable key={item.id} group={item} />;
  } else if (isOperator(item)) {
    return <RuleOperator key={item.id} operator={item} />;
  }
}

const RuleBoard = ({ ruleGroup }: RuleBoardProps) => {
  const { rules } = useMemo(() => ruleGroup, [ruleGroup]);
  const { setNodeRef } = useDroppable({ id: ruleGroup.id });

  const {
    queryBuilder: { boardIndex },
  } = useDaphneStore();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const ids = useMemo(() => {
    const list = boardIndex.itemsByContainer[ruleGroup.id] ?? [];
    return list.includes(ruleGroup.id) ? list : [...list, ruleGroup.id];
  }, [boardIndex, ruleGroup.id]);

  if (!hasMounted) {
    return <RuleBoardSkeleton />;
  }

  if (!ids || ids.length === 0) {
    return <Alert color="error"> Something wrong </Alert>;
  }

  return (
    <div ref={setNodeRef}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <Box display="flex" flexDirection="column" gap={0}>
          <DropSpacer id={`${ruleGroup.id}::top`} />
          {rules.map((rule) => {
            return <Fragment key={rule.id}>{renderRule(rule)}</Fragment>;
          })}
          <DropSpacer id={`${ruleGroup.id}::bottom`} />
        </Box>
      </SortableContext>
    </div>
  );
};

export default RuleBoard;
