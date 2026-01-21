"use client";

import useQueryBuilder from "@/store/useQueryBuilder";

import { updateById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";

import { RuleLeafType } from "@/types/rules";
import DeleteMenuItem from "../DeleteMenuItem";
import { DeleteMenuItemProps } from "../DeleteMenuItem/DeleteMenuItem";

interface DeleteTimeFrameButtonProps extends DeleteMenuItemProps {
  rule: RuleLeafType;
}

const DeleteTimeFrameButton = ({
  rule,
  ...props
}: DeleteTimeFrameButtonProps) => {
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
        return {
          ...node,
          timeConstraint: undefined,
        };
      }),
    );
  };

  return <DeleteMenuItem {...props} action={onClick} />;
};

export default DeleteTimeFrameButton;
