"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { updateById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";

import { RuleLeafType } from "@/types/rules";
import AddButton from "@/components/AddButton";
import { AddButtonProps } from "@/components/AddButton/AddButton";

interface AddAgeButtonProps extends AddButtonProps {
  rule: RuleLeafType;
}

const AddAgeButton = ({ rule, ...props }: AddAgeButtonProps) => {
  const {
    queryBuilderJson,
    setQueryBuilderJson,
    selectedGuidance,
    setSelectedGuidance,
    selected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    selectedGuidance: qb.selectedGuidance,
    setSelectedGuidance: qb.setSelectedGuidance,
    selected: qb.selected,
  }));

  const keySuffix =
    Object.keys(selected).length === 1 ? Object.keys(selected)[0] : "multiple";
  const onClick = () => {
    setSelectedGuidance(`RuleTimeframeSelector-${keySuffix}`, true);
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

  return <AddButton {...props} action={onClick} />;
};

export default AddAgeButton;
