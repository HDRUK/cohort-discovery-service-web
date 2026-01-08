"use client";

import { Fragment } from "react";

import Rule from "@/modules/Rule";
import {
  isAgeFilter,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
} from "@/utils/rules";
import { Box, BoxProps } from "@mui/material";
import { RuleGroupType, RuleNodeType } from "@/types/rules";
import RuleGroup from "@/modules/RuleGroup";
import RuleOperator from "@/modules/RuleOperator";
import { useDroppable } from "@dnd-kit/core";
import DropSpacer from "@/components/DropSpacer";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import useHasMounted from "@/hooks/useHasMounted";
import RuleAgeFilter from "../RuleAgeFilter";
import SkeletonFull from "@/components/SkeletonFull";

interface RuleBoardProps extends BoxProps {
  ruleGroup: RuleGroupType;
}

function renderRule(item: RuleNodeType, ruleGroupId: string) {
  if (isRuleLeaf(item)) {
    return <Rule key={item.id} rule={item} groupId={ruleGroupId} />;
  } else if (isRuleGroup(item)) {
    return <RuleGroup key={item.id} group={item} parentGroupId={ruleGroupId} />;
  } else if (isOperator(item)) {
    return <RuleOperator key={item.id} operator={item} groupId={ruleGroupId} />;
  } else if (isAgeFilter(item)) {
    return <RuleAgeFilter key={item.id} rule={item} groupId={ruleGroupId} />;
  }
}

const RuleBoard = ({ ruleGroup, children, ...rest }: RuleBoardProps) => {
  const { rules, id } = ruleGroup;
  const { setNodeRef } = useDroppable({
    id,
    data: { type: "container", containerId: id },
  });

  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <SkeletonFull />;
  }

  return (
    <Box
      ref={setNodeRef}
      display="flex"
      flexDirection="column"
      gap={0}
      flex={1}
      minHeight={0}
      {...rest}
    >
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
      {children}
    </Box>
  );
};

export default RuleBoard;
