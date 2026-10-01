import { Box } from "@mui/material";
import { DragType } from "@/types/dnd";
import DomainChip from "@/components/DomainChip/DomainChip";
import { Concept } from "@/types/api";
import { useCallback } from "react";
import ConceptChip from "@/components/ConceptChip";
import { RuleLeafType, SingleSidedOperator } from "@/types/rules";
import RuleSearch from "./RuleSearch";
import useRuleConceptSelection from "./useRuleConceptSelection";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import {
  isEmptyRule,
  updateById,
  isSingleConcept,
  isRuleLeaf,
} from "@/utils/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import RuleFooter from "../RuleFooter";

const CONFIRM_OR_CLEAR_MESSAGE =
  "Please confirm or clear your changes before continuing";

export interface RuleProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "render"
> {
  rule: RuleLeafType;
  groupId?: string;
}

const Rule = ({ rule, groupId, ...rest }: RuleProps) => {
  const {
    id,
    rule: { concept },
  } = rule;

  const {
    queryBuilderJson,
    setQueryBuilderJson,
    showDescendants,
    setShowDescendants,
    isSelected,
    select,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    showDescendants: qb.showDescendants[id],
    setShowDescendants: qb.setShowDescendants,
    isSelected: !!qb.selected[id],
    select: qb.select,
  }));

  const toggleShowDescendants = useCallback(
    () => setShowDescendants(id, !showDescendants),
    [id, showDescendants, setShowDescendants],
  );

  const setConcept = useCallback(
    (c: Concept | Concept[]) => {
      setQueryBuilderJson(
        updateById(queryBuilderJson, id, (node) => {
          if (isRuleLeaf(node)) {
            return {
              ...node,
              rule: { ...node.rule, concept: c },
            };
          }
          return node;
        }),
      );
    },
    [id, setQueryBuilderJson, queryBuilderJson],
  );

  const selection = useRuleConceptSelection(setConcept);

  const clearConcept = useCallback(() => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (isRuleLeaf(node)) {
          return {
            ...node,
            rule: { ...node.rule, concept: null },
            ageConstraint: undefined,
            ageConstraintOperator: SingleSidedOperator.GREATER_THAN,
            timeConstraint: undefined,
            timeConstraintOperator: SingleSidedOperator.GREATER_THAN,
            valueAsNumber: undefined,
            valueAsNumberOperator: undefined,
          };
        }
        return node;
      }),
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const removeChild = useCallback((parent: Concept, child: Concept) => {
    const children = parent.children?.filter(
      (c) => c.concept_id !== child.concept_id,
    );
    const newConcept = {
      ...parent,
      children,
    };
    return newConcept;
  }, []);

  const { actions } = useNodeActions(rule);

  const pendingConceptCount = selection.selectedConcepts.length;

  const showSearchFooter =
    isEmptyRule(rule) &&
    (isSelected ? selection.hasOptions : pendingConceptCount > 0);

  return (
    <RuleWrapper
      node={rule}
      type={DragType.Rule}
      groupId={groupId}
      sortable={true}
      headerExtra={!isEmptyRule(rule) ? <DomainChip concept={concept} /> : null}
      renderFooter={
        showSearchFooter ? (
          <RuleFooter
            message={
              pendingConceptCount > 0 ? CONFIRM_OR_CLEAR_MESSAGE : undefined
            }
            invalidReason={rule.invalidReason}
            onConfirm={selection.handleConfirm}
            onClearAll={selection.clearAll}
            confirmDisabled={pendingConceptCount < 1}
          />
        ) : undefined
      }
      render={() => (
        <Box py={1}>
          {isEmptyRule(rule) ? (
            <RuleSearch onSelect={() => select(id)} selection={selection} />
          ) : (
            <>
              {isSingleConcept(concept) && (
                <>
                  <ConceptChip
                    indicateIfParent={showDescendants}
                    concept={concept}
                    onDelete={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      clearConcept();
                    }}
                    onClick={
                      (concept?.children?.length ?? 0) > 0
                        ? (e: React.MouseEvent) => {
                            e.stopPropagation();
                            toggleShowDescendants();
                          }
                        : (e: React.MouseEvent) => {
                            e.stopPropagation();
                          }
                    }
                  />
                  {showDescendants &&
                    concept?.children?.map((childConcept) => (
                      <ConceptChip
                        key={childConcept.concept_id}
                        concept={childConcept}
                        onDelete={() => {
                          setConcept(removeChild(concept, childConcept));
                        }}
                      />
                    ))}
                </>
              )}
            </>
          )}
        </Box>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default Rule;
