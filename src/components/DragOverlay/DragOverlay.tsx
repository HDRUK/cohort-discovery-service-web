"use client";

import { createContext, useContext } from "react";
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

export const DragOverlayRenderContext = createContext(false);

export const useIsInDragOverlay = () => useContext(DragOverlayRenderContext);

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

const DragOverlay = ({ node }: { node: RuleNodeType | null }) => {
  return (
    <DndDragOverlay>
      {node ? (
        <DragOverlayRenderContext.Provider value={true}>
          {renderRule(node)}
        </DragOverlayRenderContext.Provider>
      ) : null}
    </DndDragOverlay>
  );
};

export default DragOverlay;
