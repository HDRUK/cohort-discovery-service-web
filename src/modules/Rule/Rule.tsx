import { Box } from "@mui/material";
import DomainChip from "@/components/DomainChip/DomainChip";
import { Concept } from "@/types/api";
import { useCallback } from "react";
import { RuleLeafType, SingleSidedOperator } from "@/types/rules";
import RuleSearch from "./RuleSearch";
import RuleConcept from "./RuleConcept";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import { isEmptyRule, updateById, isRuleLeaf, RuleErrors } from "@/utils/rules";

import RuleWrapper from "../RuleWrapper";
import RuleFooter from "../RuleFooter";
import RuleParameters from "../RuleParameters";
import useRuleConceptSelection from "./useRuleConceptSelection";

export interface RuleProps {
  rule: RuleLeafType;
  groupId?: string;
}

const Rule = ({ rule, groupId }: RuleProps) => {
  const {
    id,
    rule: { concept },
  } = rule;

  const { queryBuilderJson, setQueryBuilderJson, select } = useQueryBuilder(
    (qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      select: qb.select,
    }),
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

  const selection = useRuleConceptSelection(setConcept);

  const empty = isEmptyRule(rule);
  const hasPendingSelection = selection.selectedConcepts.length > 0;

  return (
    <RuleWrapper
      node={rule}
      groupId={groupId}
      draggable={!hasPendingSelection}
      renderSubTitle={!empty && <DomainChip concept={concept} />}
      renderContent={
        <Box py={1}>
          {empty ? (
            <RuleSearch onSelect={() => select(id)} selection={selection} />
          ) : (
            <RuleConcept
              rule={rule}
              onChange={setConcept}
              onClear={clearConcept}
            />
          )}
        </Box>
      }
      renderSubContent={<RuleParameters rule={rule} />}
      renderFooter={
        empty ? (
          <RuleFooter
            messages={
              hasPendingSelection
                ? [RuleErrors.UNCONFIRMED_SELECTION]
                : (rule.invalidReason ?? [])
            }
            showActions={selection.hasOptions}
            canConfirm={hasPendingSelection}
            onConfirm={selection.handleConfirm}
            onClear={selection.clearAll}
          />
        ) : undefined
      }
    />
  );
};

export default Rule;
