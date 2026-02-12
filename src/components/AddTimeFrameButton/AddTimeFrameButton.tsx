"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { updateById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";

import { RuleLeafType } from "@/types/rules";
import AddButton from "@/components/AddButton";
import { AddButtonProps } from "@/components/AddButton/AddButton";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

interface AddAgeButtonProps extends AddButtonProps {
  rule: RuleLeafType;
}

const AddAgeButton = ({ rule, ...props }: AddAgeButtonProps) => {
  const {
    queryBuilderJson,
    setQueryBuilderJson,
    setSelectedGuidance,
    selected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    setSelectedGuidance: qb.setSelectedGuidance,
    selected: qb.selected,
  }));

  const onClick = () => {
    setSelectedGuidance(
      collapsibleGuidanceKey("RuleTimeframeSelector", selected),
      true,
    );
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isRuleLeaf(node)) {
          return node;
        }
        if (node.timeConstraint?.length == 2) return node;
        return {
          ...node,
          timeConstraint: [null, null],
        };
      }),
    );
  };

  return <AddButton {...props} onClick={onClick} />;
};

export default AddAgeButton;
