"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { updateById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";

import { RuleLeafType } from "@/types/rules";
import AddButton from "@/components/AddButton";
import { AddButtonProps } from "@/components/AddButton/AddButton";

interface AddTimeFrameButtonProps extends AddButtonProps {
  rule: RuleLeafType;
}

const AddTimeFrameButton = ({ rule, ...props }: AddTimeFrameButtonProps) => {
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const onClick = () => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isRuleLeaf(node)) {
          return node;
        }
        if (node.ageConstraint?.length == 2) return node;
        return {
          ...node,
          ageConstraint: [null, null],
        };
      }),
    );
  };

  return <AddButton {...props} onClick={onClick} />;
};

export default AddTimeFrameButton;
