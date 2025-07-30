import {
  formatQuery,
  defaultOperators,
  defaultValueProcessorByRule,
  ValueProcessorByRule,
} from "react-querybuilder";
import type { Field, RuleGroupType } from "react-querybuilder";

const customValueProcessor: ValueProcessorByRule = (rule, options) => {
  const valueMap = options?.fields?.find(
    (field) => field?.name === rule.field
  )?.values;

  const label = valueMap?.find((v) => v.name === rule.value)?.label;
  if (label) return label;

  return defaultValueProcessorByRule(rule, options);
};

const getNaturalLanguage = (query: RuleGroupType, fields: Field[]) =>
  formatQuery(query, {
    format: "natural_language",
    parseNumbers: true,
    getOperators: () => defaultOperators,
    fields,
    valueProcessor: customValueProcessor,
  });

export { getNaturalLanguage };
