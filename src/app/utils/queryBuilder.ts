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

  const label = valueMap?.find(
    (v) => String(v.name) === String(rule.value)
  )?.label;

  if (label) return label;

  return defaultValueProcessorByRule(rule, options);
};

const getNaturalLanguage = (query: RuleGroupType, fields: Field[]) => {
  const text = formatQuery(query, {
    format: "natural_language",
    parseNumbers: true,
    getOperators: () => defaultOperators,
    fields,
    valueProcessor: customValueProcessor,
  });

  return text == "1 is 1" ? "" : text;
};

export { getNaturalLanguage };
