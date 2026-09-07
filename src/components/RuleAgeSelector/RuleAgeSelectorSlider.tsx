"use client";

import { ReactNode, useMemo } from "react";
import { Stack } from "@mui/material";
import { isAgeFilter, isRuleLeaf, updateById } from "@/utils/rules";
import { AgeFilterType, RuleLeafType } from "@/types/rules";
import { CustomH1 } from "@/components/GuidanceHeaders";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import HoverableDiv from "@/components/HoverableDiv";
import RuleAgeSelectorReadOnly from "./RuleAgeSelectorReadOnly";
import AgeRangeInput from "./AgeRangeInput";

export interface RuleAgeSelectorSliderProps {
  rule: RuleLeafType | AgeFilterType;
  from: number;
  to: number;
  minAge: number;
  maxAge: number;
  readOnly: boolean;
  uniDirectional: boolean;
  title?: string;
  flex: boolean;
  children?: ReactNode;
}

const RuleAgeSelectorSlider = ({
  rule,
  from,
  to,
  minAge,
  maxAge,
  readOnly,
  uniDirectional,
  title,
  flex,
  children,
}: RuleAgeSelectorSliderProps) => {
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const committedAge = useMemo<[number, number]>(() => [from, to], [from, to]);

  const handleChange = ([l, r]: [number, number]) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (isRuleLeaf(node)) {
          return {
            ...node,
            ageConstraint: [l > minAge ? l : null, r < maxAge ? r : null],
          };
        }
        if (isAgeFilter(node)) {
          return { ...node, value: [l, r] };
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
      {readOnly ? (
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          paddingY={2}
        >
          <RuleAgeSelectorReadOnly
            to={to}
            from={from}
            minAge={minAge}
            maxAge={maxAge}
          />
        </Stack>
      ) : (
        <AgeRangeInput
          value={committedAge}
          minAge={minAge}
          maxAge={maxAge}
          uniDirectional={uniDirectional}
          onChange={handleChange}
        />
      )}
      {children}
    </HoverableDiv>
  );
};

export default RuleAgeSelectorSlider;
