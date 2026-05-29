"use client";

import { DragOverlay as DndDragOverlay } from "@dnd-kit/core";

import {
  hasAlternatives,
  isMultipleConcept,
  isRuleLeaf,
  isRuleGroup,
  isOperator,
} from "@/utils/rules";

import Rule from "@/modules/Rule";
import RuleGroup from "@/modules/RuleGroup";
import RuleOperator from "@/modules/RuleOperator";
import RuleMultiConcept from "@/modules/RuleMultiConcept";
import RuleAlternatives from "@/modules/RuleAlternatives";
import { RuleNodeType } from "@/types/rules";
import { Concept } from "@/types/api";
import { ConceptChip } from "@/components/ConceptChip/ConceptChip";

function renderRule(item: RuleNodeType) {
  if (isRuleLeaf(item)) {
    if (hasAlternatives(item.rule.concept))
      return <RuleAlternatives rule={item} />;
    if (isMultipleConcept(item.rule.concept))
      return <RuleMultiConcept rule={item} />;
    return <Rule rule={item} forceShowHandle />;
  } else if (isRuleGroup(item)) {
    return <RuleGroup group={item} forceShowHandle />;
  } else if (isOperator(item)) {
    return <RuleOperator operator={item} forceShowHandle />;
  }
}

const DragOverlay = ({
  node,
  concept,
}: {
  node: RuleNodeType | null;
  concept?: Concept | null;
}) => {
  return (
    <DndDragOverlay>
      {concept ? (
        <ConceptChip concept={concept} onDelete={() => {}} draggable />
      ) : node ? (
        renderRule(node)
      ) : null}
    </DndDragOverlay>
  );
};

export default DragOverlay;
