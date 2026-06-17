"use client";

import { ReactNode } from "react";
import { AgeFilterType, RuleLeafType } from "@/types/rules";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import useFeatures from "@/hooks/useFeatures";
import { isRuleLeaf } from "@/utils/rules";
import RuleAgeSelectorSingleBound from "./RuleAgeSelectorSingleBound";
import RuleAgeSelectorSlider from "./RuleAgeSelectorSlider";

export interface RuleAgeSelectorProps {
  children?: ReactNode;
  rule: RuleLeafType | AgeFilterType;
  title?: string;
  readOnly?: boolean;
  overrideConstrainForBunny?: boolean;
  uniDirectional?: boolean;
  flex?: boolean;
}

const RuleAgeSelector = ({
  rule,
  title,
  children,
  overrideConstrainForBunny = false,
  uniDirectional = false,
  readOnly = false,
  flex = false,
}: RuleAgeSelectorProps) => {
  const { constrainForBunnyV1 } = useFeatures();

  const values = isRuleLeaf(rule) ? rule.ageConstraint : rule.age;
  if (!values) return null;

  const from = values[0] ?? MIN_AGE_FILTER;
  const to = values[1] ?? MAX_AGE_FILTER;

  const shared = {
    rule,
    from,
    to,
    minAge: MIN_AGE_FILTER,
    maxAge: MAX_AGE_FILTER,
    readOnly,
    title,
    flex,
    children,
  };

  if (constrainForBunnyV1 && !overrideConstrainForBunny) {
    return <RuleAgeSelectorSingleBound {...shared} />;
  }

  return <RuleAgeSelectorSlider {...shared} uniDirectional={uniDirectional} />;
};

export default RuleAgeSelector;
