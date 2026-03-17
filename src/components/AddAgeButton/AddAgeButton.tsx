"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { updateById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";

import { RuleLeafType } from "@/types/rules";
import AddChip from "@/components/AddChip";
import { AddChipProps } from "@/components/AddChip/AddChip";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

type AddAgeChipProps = Omit<AddChipProps, "onClick"> & {
  rule: RuleLeafType;
  hoverKey?: string;
  onClick?: () => void;
};

const AddAgeButton = ({ rule, ...props }: AddAgeChipProps) => {
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
      true,
    );
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

  return <AddChip {...props} onClick={onClick} />;
};

export default AddAgeButton;
