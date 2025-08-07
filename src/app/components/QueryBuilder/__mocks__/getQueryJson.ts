import { RuleGroupType } from "react-querybuilder";

export const getQueryJson = (rest?: Partial<RuleGroupType>): RuleGroupType => ({
  combinator: "and",
  rules: [
    {
      field: "age",
      operator: ">",
      value: 60,
      id: "82a1203f-9dc3-4b94-a473-afa5e33bc59a",
    },
    {
      field: "condition",
      operator: "=",
      value: "201826",
      id: "baf27009-46a0-49d9-acba-65b7111ef21d",
    },
  ],
  id: "c15f7a8c-851b-4793-80ad-8ebde355c3bc",
  ...rest,
});
