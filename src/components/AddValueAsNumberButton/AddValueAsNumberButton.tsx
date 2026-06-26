"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import { updateById, isRuleLeaf } from "@/utils/rules";
import { RuleLeafType } from "@/types/rules";
import AddChip from "@/components/AddChip";
import { AddChipProps } from "@/components/AddChip/AddChip";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

type AddValueAsNumberButtonProps = Omit<AddChipProps, "onClick"> & {
  rule: RuleLeafType;
  hoverKey?: string;
  onClick?: () => void;
};

const AddValueAsNumberButton = ({
  rule,
  ...props
}: AddValueAsNumberButtonProps) => {
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
      true,
    );
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isRuleLeaf(node)) return node;
        if (node.valueAsNumber?.length === 2) return node;
        return {
          ...node,
          valueAsNumber: [null, null],
        };
      }),
    );
  };

  return <AddChip {...props} onClick={onClick} />;
};

export default AddValueAsNumberButton;
