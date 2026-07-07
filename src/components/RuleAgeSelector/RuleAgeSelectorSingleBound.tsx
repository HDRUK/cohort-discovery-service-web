"use client";

import { ReactNode, useMemo } from "react";
import { isDemographicFilter, isRuleLeaf, updateById } from "@/utils/rules";
import {
  DemographicFilterType,
  RuleLeafType,
  SingleSidedOperator,
} from "@/types/rules";
import { CustomH1 } from "@/components/GuidanceHeaders";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import SingleBoundSelector, {
  NullablePair,
} from "@/components/SingleBoundSelector";
import { clamp } from "@/utils/numbers";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";
import HoverableDiv from "@/components/HoverableDiv";
import RuleAgeSelectorReadOnly from "./RuleAgeSelectorReadOnly";
import AgeInput from "./AgeInput";

export interface RuleAgeSelectorSingleBoundProps {
  rule: RuleLeafType | DemographicFilterType;
  from: number;
  to: number;
  minAge: number;
  maxAge: number;
  readOnly: boolean;
  title?: string;
  flex: boolean;
  children?: ReactNode;
}

const RuleAgeSelectorSingleBound = ({
  rule,
  from,
  to,
  minAge,
  maxAge,
  readOnly,
  title,
  flex,
  children,
}: RuleAgeSelectorSingleBoundProps) => {
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

  const ageConstraint: NullablePair<number> = useMemo(() => {
    if (isRuleLeaf(rule)) {
      return rule.ageConstraint ?? [null, null];
    }

    const l = rule.value?.[0] ?? minAge;
    const r = rule.value?.[1] ?? maxAge;

    return [l === minAge ? null : l, r === maxAge ? null : r];
  }, [rule, minAge, maxAge]);

  const key = collapsibleGuidanceKey("RuleAgeSelector", selected);

  const handleConstraintChange = (
    next: NullablePair<number>,
    nextOperator: SingleSidedOperator,
  ) => {
    setSelectedGuidance(key, true);

    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        const left = next[0] == null ? null : clamp(next[0], minAge, maxAge);
        const right = next[1] == null ? null : clamp(next[1], minAge, maxAge);

        if (isRuleLeaf(node)) {
          return {
            ...node,
            ageConstraint: [
              left != null && left > minAge ? left : null,
              right != null && right < maxAge ? right : null,
            ],
            ageConstraintOperator: nextOperator,
          };
        }

        if (isDemographicFilter(node)) {
          if (left != null) return { ...node, value: [left, maxAge] };
          if (right != null) return { ...node, value: [minAge, right] };
          return { ...node, value: [minAge, maxAge] };
        }

        return node;
      }),
    );
  };

  return (
    <HoverableDiv
      stopPropagation={!readOnly}
      hoverKey={`rule-age-${rule.id}`}
      flex={flex}
    >
      {title && <CustomH1>{title}</CustomH1>}
      <SingleBoundSelector<number>
        constraint={ageConstraint}
        constraintOperator={
          rule.ageConstraintOperator ?? SingleSidedOperator.GREATER_THAN
        }
        readOnly={readOnly}
        anyLabel="Any age"
        onConstraintChange={handleConstraintChange}
        renderPicker={({ value, onChange }) => (
          <AgeInput
            value={value}
            onChange={onChange}
            minAge={minAge}
            maxAge={maxAge}
          />
        )}
        renderReadOnlyLabel={() => (
          <RuleAgeSelectorReadOnly
            to={to}
            from={from}
            minAge={minAge}
            maxAge={maxAge}
          />
        )}
      />
      {children}
    </HoverableDiv>
  );
};

export default RuleAgeSelectorSingleBound;
