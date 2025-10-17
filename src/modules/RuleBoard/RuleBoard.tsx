"use client";

import { useEffect, useState, useMemo, Fragment } from "react";
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

function renderRule(item: RuleNodeType, ruleGroupId: string, idx: number) {
  if (isRuleLeaf(item)) {
    return <Rule key={item.id} rule={item} groupId={ruleGroupId} />;
  } else if (isRuleGroup(item)) {
    return (
      <>
        <RuleGroup key={item.id} group={item} parentGroupId={ruleGroupId} />
        {/*<DropSpacer
          id={`${item.id}::outerBottom`}
          position={idx + 1}
          groupId={ruleGroupId}
        />*/}
      </>
    );
  } else if (isOperator(item)) {
    return <RuleOperator key={item.id} operator={item} groupId={ruleGroupId} />;
  }
}

const RuleBoard = ({ ruleGroup }: RuleBoardProps) => {
  const { rules } = useMemo(() => ruleGroup, [ruleGroup]);
  const { setNodeRef } = useDroppable({
    id: ruleGroup.id,
    data: { type: "container", containerId: ruleGroup.id },
  });

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <RuleBoardSkeleton />;
  }
  //
  return (
    <div ref={setNodeRef}>
      <Box display="flex" flexDirection="column" gap={0}>
        <DropSpacer
          id={`${ruleGroup.id}::top`}
          position="top"
          groupId={ruleGroup.id}
        />
        <SortableContext
          items={rules.map((r) => r.id)}
          strategy={verticalListSortingStrategy}
        >
          {rules.map((rule, idx) => {
            return (
              <Fragment key={rule.id}>
                {renderRule(rule, ruleGroup.id, idx)}
              </Fragment>
            );
          })}
        </SortableContext>
        <DropSpacer
          id={`${ruleGroup.id}::bottom`}
          position="bottom"
          groupId={ruleGroup.id}
        />
      </Box>
    </div>
  );
};

export default RuleBoard;
