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

interface RuleProps {
  group: RuleGroupType;
  parentGroupId: string;
  showConnector?: boolean;
}

const RuleGroup = ({ group, parentGroupId }: RuleProps) => {
  const { id, rules, exclude, valid = true } = group;
  const {
    queryBuilder: { queryBuilderJson, setQueryBuilderJson },
  } = useDaphneStore();

  const handleCollapseGroup = () => {};

  const handleCreateNewRule = () => {
    const newRules = [...rules, createRule()];

    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => ({
        ...node,
        rules: newRules,
      }))
    );
  };

  const handleCreateNewOperator = () => {
    const newRules = [...rules, createOperator()];

    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => ({
        ...node,
        rules: newRules,
      }))
    );
  };

  const handleDeleteRule = () => {
    setQueryBuilderJson(removeById(queryBuilderJson, id));
  };

  const actions = [
    { action: handleCreateNewRule, label: "Add Rule" },
    { action: handleCreateNewOperator, label: "Add Operator" },
    { action: handleCollapseGroup, label: "Collapse Group" },
    { action: handleDeleteRule, label: "Delete" },
  ];

  return (
    <RuleWrapper
      id={id}
      type="Group"
      groupId={parentGroupId}
      sortable={true}
      exclude={exclude}
      valid={valid}
      render={() => <RuleBoard ruleGroup={group} />}
      actions={actions}
    />
  );
};

export default RuleGroup;
