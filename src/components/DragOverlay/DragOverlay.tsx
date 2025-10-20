"use client";

import { DragOverlay as DndDragOverlay } from "@dnd-kit/core";

import { isRuleLeaf, isRuleGroup, isOperator } from "@/utils/rules";

import Rule from "@/modules/Rule";
import RuleGroup from "@/modules/RuleGroup";
import RuleOperator from "@/modules/RuleOperator";
import { RuleNodeType } from "@/types/rules";

function renderRule(item: RuleNodeType) {
  if (isRuleLeaf(item)) {
    return <Rule rule={item} forceShowHandle />;
  } else if (isRuleGroup(item)) {
    return <RuleGroup group={item} forceShowHandle />;
  } else if (isOperator(item)) {
    return <RuleOperator operator={item} forceShowHandle />;
  }
}

const DragOverlay = ({ node }: { node: RuleNodeType | null }) => {
  return <DndDragOverlay>{node ? renderRule(node) : null}</DndDragOverlay>;
};

export default DragOverlay;
