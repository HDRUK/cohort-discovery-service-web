"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { updateById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";

import { RuleLeafType } from "@/types/rules";
import DeleteMenuItem from "../DeleteMenuItem";
import { DeleteMenuItemProps } from "../DeleteMenuItem/DeleteMenuItem";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

type DeleteAgeButtonProps = Omit<DeleteMenuItemProps, "action" | "label"> & {
  rule: RuleLeafType;
};

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

  const onClick = () => {
    setSelectedGuidance(
      collapsibleGuidanceKey("RuleAgeSelector", selected),
      false,
    );
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
