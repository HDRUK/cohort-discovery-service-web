"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { isRuleLeaf, updateById } from "@/utils/rules";
import { RuleLeafType } from "@/types/rules";
import AddChip from "@/components/AddChip";
import { AddChipProps } from "@/components/AddChip/AddChip";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

type AddTimeframeChipProps = Omit<AddChipProps, "onClick"> & {
  rule: RuleLeafType;
  hoverKey?: string;
  onClick?: () => void;
};

const AddTimeFrameButton = ({ rule, ...props }: AddTimeframeChipProps) => {
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

  return <AddChip {...props} onClick={onClick} />;
};

export default AddTimeFrameButton;
