"use client";

import { MouseEvent, ReactNode } from "react";
import { Paper, Stack, Typography } from "@mui/material";
import { isRuleLeaf, updateById } from "@/utils/rules";
import { RuleLeafType, ValueAsNumberOperator } from "@/types/rules";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";
import HoverableDiv from "@/components/HoverableDiv";
import OperatorToggle from "@/components/OperatorToggle";
import NumericValueInput from "./NumericValueInput";

export interface RuleValueAsNumberSelectorProps {
  rule: RuleLeafType;
  readOnly: boolean;
  flex: boolean;
  children?: ReactNode;
}

function deriveCurrentValue(
  valueAsNumber: [number | null, number | null] | undefined,
  operator: ValueAsNumberOperator,
): { lower: number | null; upper: number | null } {
  const [l, r] = valueAsNumber ?? [null, null];
  if (operator === ValueAsNumberOperator.BETWEEN) {
    return { lower: l, upper: r };
  }
  if (operator === ValueAsNumberOperator.GREATER_THAN) {
    return { lower: l ?? r, upper: null };
  }
  return { lower: null, upper: r ?? l };
}

function buildConstraint(
  operator: ValueAsNumberOperator,
  lower: number | null,
  upper: number | null,
): [number | null, number | null] {
  if (operator === ValueAsNumberOperator.BETWEEN) return [lower, upper];
  if (operator === ValueAsNumberOperator.GREATER_THAN) return [lower, null];
  return [null, upper];
}

function operatorSwitchConstraint(
  prev: [number | null, number | null] | undefined,
  prevOperator: ValueAsNumberOperator,
  nextOperator: ValueAsNumberOperator,
): [number | null, number | null] {
  const [l, r] = prev ?? [null, null];
  const singleValue =
    prevOperator === ValueAsNumberOperator.GREATER_THAN ? l : r;

  if (nextOperator === ValueAsNumberOperator.BETWEEN) {
    return [singleValue, null];
  }
  if (prevOperator === ValueAsNumberOperator.BETWEEN) {
    return nextOperator === ValueAsNumberOperator.GREATER_THAN
      ? [l, null]
      : [null, r];
  }
  // toggling between ≥ and <
  return nextOperator === ValueAsNumberOperator.GREATER_THAN
    ? [singleValue, null]
    : [null, singleValue];
}

function readOnlyLabel(
  operator: ValueAsNumberOperator,
  lower: number | null,
  upper: number | null,
): string {
  if (operator === ValueAsNumberOperator.BETWEEN) {
    if (lower == null && upper == null) return "Any value";
    if (lower == null) return `Value < ${upper}`;
    if (upper == null) return `Value ≥ ${lower}`;
    return `${lower} ≤ Value < ${upper}`;
  }
  const value = operator === ValueAsNumberOperator.GREATER_THAN ? lower : upper;
  if (value == null) return "Any value";
  return operator === ValueAsNumberOperator.GREATER_THAN
    ? `Value ≥ ${value}`
    : `Value < ${value}`;
}

const RuleValueAsNumberSelector = ({
  rule,
  readOnly,
  flex,
  children,
}: RuleValueAsNumberSelectorProps) => {
  const {
    queryBuilderJson,
    setQueryBuilderJson,
    setSelectedGuidance,
    selected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    setSelectedGuidance: qb.setSelectedGuidance,
    selected: qb.selected,
  }));

  const operator: ValueAsNumberOperator =
    rule.valueAsNumberOperator ?? ValueAsNumberOperator.GREATER_THAN;

  const { lower, upper } = deriveCurrentValue(rule.valueAsNumber, operator);

  const key = collapsibleGuidanceKey("RuleValueAsNumberSelector", selected);

  const handleOperatorChange = (nextOperator: ValueAsNumberOperator) => {
    setSelectedGuidance(key, true);
    const nextConstraint = operatorSwitchConstraint(
      rule.valueAsNumber,
      operator,
      nextOperator,
    );
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isRuleLeaf(node)) return node;
        return {
          ...node,
          valueAsNumber: nextConstraint,
          valueAsNumberOperator: nextOperator,
        };
      }),
    );
  };

  const handleLowerChange = (value: number | null) => {
    setSelectedGuidance(key, true);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isRuleLeaf(node)) return node;
        return {
          ...node,
          valueAsNumber: buildConstraint(operator, value, upper),
          valueAsNumberOperator: operator,
        };
      }),
    );
  };

  const handleUpperChange = (value: number | null) => {
    setSelectedGuidance(key, true);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isRuleLeaf(node)) return node;
        return {
          ...node,
          valueAsNumber: buildConstraint(operator, lower, value),
          valueAsNumberOperator: operator,
        };
      }),
    );
  };

  return (
    <HoverableDiv
      stopPropagation={!readOnly}
      hoverKey={`rule-value-as-number-${rule.id}`}
      flex={flex}
    >
      {readOnly ? (
        <Paper sx={{ border: 1, p: 1 }}>
          {readOnlyLabel(operator, lower, upper)}
        </Paper>
      ) : (
        <Stack direction="row" gap={1} alignItems="center">
          <OperatorToggle
            operator={operator}
            operators={[
              ValueAsNumberOperator.GREATER_THAN,
              ValueAsNumberOperator.LESS_THAN,
              ValueAsNumberOperator.BETWEEN,
            ]}
            operatorLabels={{
              [ValueAsNumberOperator.GREATER_THAN]: "≥",
              [ValueAsNumberOperator.LESS_THAN]: "<",
              [ValueAsNumberOperator.BETWEEN]: "↔",
            }}
            handleOperatorChange={(_e: MouseEvent<HTMLElement>, op: ValueAsNumberOperator) => handleOperatorChange(op)}
            readOnly={readOnly}
          />
          <NumericValueInput value={lower} onChange={handleLowerChange} />
          {operator === ValueAsNumberOperator.BETWEEN && (
            <>
              <Typography variant="body2" sx={{ flexShrink: 0 }}>
                –
              </Typography>
              <NumericValueInput value={upper} onChange={handleUpperChange} />
            </>
          )}
        </Stack>
      )}
      {children}
    </HoverableDiv>
  );
};

export default RuleValueAsNumberSelector;
