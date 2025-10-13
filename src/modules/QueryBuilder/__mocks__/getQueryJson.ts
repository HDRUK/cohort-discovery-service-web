import { RuleGroupType } from "@/types/rules";
import { EXAMPLE_1 } from "@/config/queryExamples";

export const getQueryJson = (rest?: Partial<RuleGroupType>): RuleGroupType => ({
  ...EXAMPLE_1,
  ...rest,
});
