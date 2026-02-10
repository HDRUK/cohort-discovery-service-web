"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { updateById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";

import { RuleLeafType } from "@/types/rules";
import DeleteMenuItem from "../DeleteMenuItem";
import { DeleteMenuItemProps } from "../DeleteMenuItem/DeleteMenuItem";

interface DeleteAgeButtonProps extends DeleteMenuItemProps {
  rule: RuleLeafType;
}

const DeleteAgeButton = ({ rule, ...props }: DeleteAgeButtonProps) => {
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

  const keySuffix =
    Object.keys(selected).length === 1 ? Object.keys(selected)[0] : "multiple";
  const onClick = () => {
    setSelectedGuidance(`RuleAgeSelector-${keySuffix}`, false);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isRuleLeaf(node)) {
          return node;
        }
        return {
          ...node,
          ageConstraint: undefined,
        };
      }),
    );
  };

  return <DeleteMenuItem {...props} action={onClick} />;
};

export default DeleteAgeButton;
