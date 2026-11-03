import useFeatures from "@/hooks/useFeatures";
import { RuleLeafType } from "@/types/rules";
import { categoryHasSelectors, isValueAsNumberDomain } from "@/utils/omop";
import { getPrimaryConcept, isEmptyRule } from "@/utils/rules";

export interface UseRuleParametersResult {
  hasParameters: boolean;
  hasValue: boolean;
  canAddTimeframe: boolean;
  canAddAge: boolean;
}

const useRuleParameters = (rule: RuleLeafType): UseRuleParametersResult => {
  const { constrainForBunnyV1, queryBuilderUseValueAsNumber } = useFeatures();
  const category = getPrimaryConcept(rule.rule.concept)?.category ?? "";

  return {
    hasParameters: !isEmptyRule(rule) && categoryHasSelectors(category),
    hasValue:
      queryBuilderUseValueAsNumber && isValueAsNumberDomain(rule.rule.concept),
    canAddTimeframe: !constrainForBunnyV1 || !rule.ageConstraint,
    canAddAge: !constrainForBunnyV1 || !rule.timeConstraint,
  };
};

export default useRuleParameters;
