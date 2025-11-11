import { RuleGroupType } from "@/types/rules";
import { useDaphneStore } from "@/store/useDaphneStore";

import {
  updateById,
  removeById,
  createRule,
  createOperator,
} from "@/utils/rules";

import RuleBoard from "../RuleBoard";
import RuleWrapper from "../RuleWrapper";
import { useCallback } from "react";

export interface RuleGroupProps {
  group: RuleGroupType;
  parentGroupId?: string;
  showConnector?: boolean;
}

const RuleGroup = ({ group, parentGroupId, ...rest }: RuleGroupProps) => {
  const { id, rules, exclude, valid = true } = group;

  const queryBuilderJson = useDaphneStore(
    (s) => s.queryBuilder.queryBuilderJson
  );
  const setQueryBuilderJson = useDaphneStore(
    (s) => s.queryBuilder.setQueryBuilderJson
  );

  const handleCollapseGroup = () => {};

  const handleCreateNewRule = useCallback(() => {
    const newRules = [createRule(), createOperator(), ...rules];

    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => ({
        ...node,
        rules: newRules,
      }))
    );
  }, [id, rules, queryBuilderJson, setQueryBuilderJson]);

  const handleDeleteRule = useCallback(() => {
    setQueryBuilderJson(removeById(queryBuilderJson, id));
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const actions = [
    { action: handleCreateNewRule, label: "Add Rule" },
    { action: handleCollapseGroup, label: "Collapse Group" },
    { action: handleDeleteRule, label: "Delete" },
  ];

  return (
    <RuleWrapper
      node={group}
      type="Group"
      groupId={parentGroupId}
      sortable={true}
      exclude={exclude}
      valid={valid}
      render={() => <RuleBoard ruleGroup={group} />}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleGroup;
