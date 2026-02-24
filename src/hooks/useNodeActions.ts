import useQueryBuilder from "@/hooks/useQueryBuilder";
import { CombinatorType, RuleNodeType } from "@/types/rules";
import {
  createOperator,
  createRule,
  isOperator,
  isRuleGroup,
  isRuleLeaf,
  removeById,
  ruleToGroup,
  groupToRules,
  updateById,
  createRuleGroup,
  findById,
  findByIdWithNeighbors,
  getSelectedOrdered,
} from "@/utils/rules";
import { useCallback, useMemo } from "react";

export interface RightClickAction {
  action: () => void;
  label: string;
}

const useNodeActions = (
  node?: RuleNodeType,
): {
  actions: RightClickAction[];
  handleDeleteRule: () => void;
  handleConvertToGroup: () => void;
  handleChangeOperator: () => void;
  handleCollapseGroup: () => void;
  handleCreateNewRule: () => void;
} => {
  const { id } = node ?? { id: "" };

  const { queryBuilderJson, setQueryBuilderJson, selected } = useQueryBuilder(
    (qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      selected: qb.selected,
    }),
  );
  const selectedNodeIds = useMemo(
    () => getSelectedOrdered(selected, queryBuilderJson),
    [selected, queryBuilderJson],
  );
  const currentIdIsSelectedNode = useMemo(
    () => selectedNodeIds.includes(id),
    [selectedNodeIds, id],
  );

  const handleDeleteRule = useCallback(() => {
    if (currentIdIsSelectedNode && selectedNodeIds.length > 1) {
      const newQuery = selectedNodeIds.reduce(
        (acc, id) => removeById(acc, id as string),
        queryBuilderJson,
      );
      setQueryBuilderJson(newQuery);
      return;
    }

    const newQuery = removeById(queryBuilderJson, id);
    setQueryBuilderJson(newQuery);
  }, [
    id,
    queryBuilderJson,
    setQueryBuilderJson,
    currentIdIsSelectedNode,
    selectedNodeIds,
  ]);

  const handleConvertToGroup = useCallback(() => {
    if (currentIdIsSelectedNode && selectedNodeIds.length > 1) {
      const [primaryId, ...otherIds] = selectedNodeIds;

      const newRules = selectedNodeIds
        .map((id) => findById(queryBuilderJson, id as string))
        .filter((x) => !!x);

      const lastNode = newRules[newRules.length - 1];
      const lastId = lastNode.id;

      const lastIdIsOperator = isOperator(lastNode);

      const newGroup = createRuleGroup(
        lastIdIsOperator ? [...newRules, createRule()] : newRules,
      );

      const queryJsonWithOtherIdsRemoved = otherIds.reduce(
        (acc, id) => removeById(acc, id as string),
        queryBuilderJson,
      );

      const { below } = findByIdWithNeighbors(queryBuilderJson, lastId);
      const belowIsOperator = below ? isOperator(below) : false;

      const queryJsonWithNewGroup = updateById(
        queryJsonWithOtherIdsRemoved,
        primaryId as string,
        () => newGroup,
        !belowIsOperator && !!below
          ? {
              node: createOperator(),
              position: "after",
            }
          : undefined,
      );

      setQueryBuilderJson(queryJsonWithNewGroup);
      return;
    }
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (!isRuleLeaf(node)) return node;
        const newGroup = ruleToGroup(node);
        return newGroup;
      }),
    );
  }, [
    id,
    queryBuilderJson,
    setQueryBuilderJson,
    selectedNodeIds,
    currentIdIsSelectedNode,
  ]);

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
      }),
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const handleCollapseGroup = useCallback(() => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (!isRuleGroup(node)) return node;
        const newGroup = groupToRules(node);
        return newGroup;
      }),
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const rules = node && isRuleGroup(node) ? node.rules : undefined;
  const handleCreateNewRule = useCallback(() => {
    if (!rules) return;
    const newRules = [createRule(), createOperator(), ...rules];

    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => ({
        ...node,
        rules: newRules,
      })),
    );
  }, [id, rules, queryBuilderJson, setQueryBuilderJson]);

  const actions = [
    { action: handleDeleteRule, label: "Delete" },
    ...((node && isRuleLeaf(node)) ||
    (currentIdIsSelectedNode && selectedNodeIds.length > 1)
      ? [{ action: handleConvertToGroup, label: "Convert to Group" }]
      : []),
    ...(node && isOperator(node)
      ? [{ action: handleChangeOperator, label: "Change Operator" }]
      : []),
    ...(node && isRuleGroup(node)
      ? [
          { action: handleCreateNewRule, label: "Add Rule" },
          { action: handleCollapseGroup, label: "Collapse Group" },
        ]
      : []),
  ];

  return {
    actions,
    handleDeleteRule,
    handleConvertToGroup,
    handleChangeOperator,
    handleCollapseGroup,
    handleCreateNewRule,
  };
};

export default useNodeActions;
