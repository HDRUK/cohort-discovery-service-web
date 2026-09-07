"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import { updateById, isRuleLeaf } from "@/utils/rules";
import { RuleLeafType } from "@/types/rules";
import DeleteMenuItem from "@/components/DeleteMenuItem";
import { DeleteMenuItemProps } from "@/components/DeleteMenuItem/DeleteMenuItem";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

type DeleteValueAsNumberButtonProps = Omit<
  DeleteMenuItemProps,
  "action" | "label"
> & {
  rule: RuleLeafType;
};

const DeleteValueAsNumberButton = ({
  rule,
  ...props
}: DeleteValueAsNumberButtonProps) => {
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
      collapsibleGuidanceKey("RuleValueAsNumberSelector", selected),
      false,
    );
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isRuleLeaf(node)) return node;
        return {
          ...node,
          valueAsNumber: undefined,
          valueAsNumberOperator: undefined,
        };
      }),
    );
  };

  return <DeleteMenuItem {...props} action={onClick} />;
};

export default DeleteValueAsNumberButton;
