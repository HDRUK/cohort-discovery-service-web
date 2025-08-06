"use client";

import { useEffect, useState } from "react";
import {
  Field,
  QueryBuilder as ReactQueryBuilder,
  defaultControlElements,
} from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { useDaphneStore } from "@/store/useDaphneStore";
import { QueryBuilderSkeleton } from "./QueryBuilderSkeleton";
import RuleGroupHeader from "./controls/RuleGroupHeader";
import RuleGroupBody from "./controls/RuleGroupBody";
import Rule from "./controls/Rule";
import ValueEditor from "./controls/ValueEditor";
import AddGroupAction from "./controls/AddGroupAction";
import AddRuleAction from "./controls/AddRuleAction";
import RemoveGroupAction from "./controls/RemoveGroupAction";
import RemoveRuleAction from "./controls/RemoveRuleAction";
import CloneRuleAction from "./controls/CloneRuleAction";
import CloneGroupAction from "./controls/CloneGroupAction";
import LockRuleAction from "./controls/LockRuleAction";
import LockGroupAction from "./controls/LockGroupAction";
import FieldSelector from "./controls/FieldSelector";
import OperatorSelector from "./controls/OperatorSelector";
import CombinatorSelector from "./controls/CombinatorSelector";
import ValueSourceSelector from "./controls/ValueSourceSelector";
import NotToggle from "./controls/NotToggle";

const customControlElements = {
  ...defaultControlElements,
  addGroupAction: AddGroupAction,
  addRuleAction: AddRuleAction,
  removeGroupAction: RemoveGroupAction,
  removeRuleAction: RemoveRuleAction,
  cloneRuleAction: CloneRuleAction,
  cloneGroupAction: CloneGroupAction,
  lockRuleAction: LockRuleAction,
  lockGroupAction: LockGroupAction,
  fieldSelector: FieldSelector,
  operatorSelector: OperatorSelector,
  combinatorSelector: CombinatorSelector,
  valueSourceSelector: ValueSourceSelector,
  valueEditor: ValueEditor,
  notToggle: NotToggle,
  ruleGroupHeaderElements: RuleGroupHeader,
  ruleGroupBodyElements: RuleGroupBody,
  rule: Rule,
};

const QueryBuilder = ({ fields }: { fields: Field[] }) => {
  const {
    queryBuilder: { queryBuilderJson, setQueryBuilderJson },
    stateManagement: { isLoading },
  } = useDaphneStore();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || isLoading) {
    return <QueryBuilderSkeleton />;
  }

  return (
    <ReactQueryBuilder
      fields={fields}
      query={queryBuilderJson}
      onQueryChange={setQueryBuilderJson}
      addRuleToNewGroups
      debugMode
      listsAsArrays
      parseNumbers="strict-limited"
      showCloneButtons
      showLockButtons
      showNotToggle
      controlClassnames={{
        queryBuilder: "queryBuilder-branches ",
      }}
      controlElements={customControlElements}
    />
  );
};

export default QueryBuilder;
