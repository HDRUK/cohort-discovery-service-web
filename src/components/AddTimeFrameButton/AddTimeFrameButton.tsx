"use client";

import useQueryBuilder from "@/hooks/useQueryBuilder";

import { isRuleLeaf, updateById } from "@/utils/rules";
import { RuleLeafType } from "@/types/rules";
import AddButton from "@/components/AddButton";
import { AddButtonProps } from "@/components/AddButton/AddButton";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";
import useHoverable from "@/hooks/useHoverable";

type AddTimeframeChipProps = Omit<AddButtonProps, "onClick"> & {
  rule: RuleLeafType;
  hoverKey?: string;
  onClick?: () => void;
};

const AddTimeFrameButton = ({
  rule,
  hoverKey,
  ...props
}: AddTimeframeChipProps) => {
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

  return (
    <AddButton
      {...props}
      ref={setHoverRef}
      highlighted={isHighlighted}
      onClick={onClick}
    />
  );
};

export default AddTimeFrameButton;
