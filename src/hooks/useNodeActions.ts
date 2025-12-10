import useQueryBuilder from "@/store/useQueryBuilder";
import { CombinatorType, RuleNodeType } from "@/types/rules";
import {
  createOperator,
  createRule,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
  removeById,
  ruleToGroup,
  updateById,
} from "@/utils/rules";
import { useCallback } from "react";

const useNodeActions = (node: RuleNodeType) => {
  const { id } = node;

  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const handleDeleteRule = useCallback(() => {
    const newQuery = removeById(queryBuilderJson, id);
    setQueryBuilderJson(newQuery);
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const handleConvertToGroup = useCallback(() => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (!isRuleLeaf(node)) return node;
        const newGroup = ruleToGroup(node);
        return newGroup;
      })
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const handleChangeOperator = useCallback(() => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (isOperator(node)) {
          return {
            ...node,
            combinator:
              node.combinator === CombinatorType.AND
                ? CombinatorType.OR
                : CombinatorType.AND,
          };
        }
        return node;
      })
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  //const handleCollapseGroup = () => {};

  const rules = isRuleGroup(node) ? node.rules : undefined;
  const handleCreateNewRule = useCallback(() => {
    if (!rules) return;
    const newRules = [createRule(), createOperator(), ...rules];

    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => ({
        ...node,
        rules: newRules,
      }))
    );
  }, [id, rules, queryBuilderJson, setQueryBuilderJson]);

  const actions = [
    { action: handleDeleteRule, label: "Delete" },
    ...(isRuleLeaf(node)
      ? [{ action: handleConvertToGroup, label: "Convert to Group" }]
      : []),
    ...(isOperator(node)
      ? [{ action: handleChangeOperator, label: "Change Operator" }]
      : []),
    ...(isRuleGroup(node)
      ? [
          { action: handleCreateNewRule, label: "Add Rule" },
          //{ action: handleCollapseGroup, label: "Collapse Group" }, - to be implemented
        ]
      : []),
  ];

  return actions;
};

export default useNodeActions;
