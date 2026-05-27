"use client";

import { Fragment, useRef } from "react";

import Rule from "@/modules/Rule";
import {
  isAgeFilter,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
} from "@/utils/rules";
import { Box, BoxProps } from "@mui/material";
import { RuleGroupType, RuleNodeType } from "@/types/rules";
import RuleGroup, { RuleGroupSlim } from "@/modules/RuleGroup";
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
import useStateManagement from "@/hooks/useStateManagement";
import useScrollToNode from "@/hooks/useScrollToNode";

interface RuleBoardProps extends BoxProps {
  ruleGroup: RuleGroupType;
  scrollable?: boolean;
}

function renderRule(item: RuleNodeType, ruleGroupId: string) {
  if (isRuleLeaf(item)) {
    return <Rule key={item.id} rule={item} groupId={ruleGroupId} />;
  } else if (isRuleGroup(item)) {
    return (
      <RuleGroupSlim key={item.id} group={item} parentGroupId={ruleGroupId} />
    );
    //return <RuleGroup key={item.id} group={item} parentGroupId={ruleGroupId} />;
  } else if (isOperator(item)) {
    return <RuleOperator key={item.id} operator={item} groupId={ruleGroupId} />;
  } else if (isAgeFilter(item)) {
    return <RuleAgeFilter key={item.id} rule={item} groupId={ruleGroupId} />;
  }
}

const RuleBoard = ({
  ruleGroup,
  children,
  scrollable = false,
  ...rest
}: RuleBoardProps) => {
  const { rules, id } = ruleGroup;
  const { setNodeRef } = useDroppable({
    id,
    data: { type: "container", containerId: id },
  });
  const boardRef = useRef<HTMLDivElement | null>(null);

  const setBoardRef = (el: HTMLDivElement | null) => {
    setNodeRef(el);
    boardRef.current = el;
  };

  const isLoading = useStateManagement((s) => s.isLoading);
  const hasMounted = useHasMounted();

  useScrollToNode({
    enabled: scrollable,
    boardRef,
  });

  if (!hasMounted || isLoading) {
    return <SkeletonFull />;
  }

  return (
    <Box
      ref={setBoardRef}
      display="flex"
      flexDirection="column"
      gap={0}
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
