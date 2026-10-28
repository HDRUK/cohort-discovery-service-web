"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { updateById } from "@/utils/rules";
import { isRuleLeaf } from "@/utils/rules";

import { RuleLeafType } from "@/types/rules";
import AddButton from "@/components/AddButton";
import { AddButtonProps } from "@/components/AddButton/AddButton";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";
import useHoverable from "@/hooks/useHoverable";

type AddAgeChipProps = Omit<AddButtonProps, "onClick"> & {
  rule: RuleLeafType;
  hoverKey?: string;
  onClick?: () => void;
};

const AddAgeButton = ({ rule, hoverKey, ...props }: AddAgeChipProps) => {
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

  const { setHoverRef, isHighlighted } =
    useHoverable<HTMLButtonElement>(hoverKey);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <AddButton
      {...props}
      ref={setHoverRef}
      highlighted={isHighlighted}
      onClick={onClick}
    />
  );
};

export default AddAgeButton;
