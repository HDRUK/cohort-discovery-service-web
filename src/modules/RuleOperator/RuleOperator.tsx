"use client";

import { Box, Chip, Divider } from "@mui/material";
import { CombinatorType, OperatorType } from "@/types/rules";
import RuleWrapper from "../RuleWrapper";
import useQueryBuilder from "@/store/useQueryBuilder";
import { isOperator, removeById, updateById } from "@/utils/rules";
import { cardSx, rootSx, dividerSx, chipSx } from "./RuleOperator.styles";
import { useCallback } from "react";
import InvalidRule from "@/components/InvalidRule";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";

export interface RuleOperatorProps
  extends Omit<RuleWrapperProps, "node" | "type" | "render"> {
  operator: OperatorType;
  groupId?: string;
  hidden?: boolean;
}

const RuleOperator = ({
  operator,
  groupId,
  hidden = false,
  ...rest
}: RuleOperatorProps) => {
  const { id, combinator, valid = true, invalidReason } = operator;

  const { isSelected, queryBuilderJson, setQueryBuilderJson } = useQueryBuilder(
    (qb) => ({
      isSelected: !!qb.selected[id],
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
    })
  );

  const handleDeleteRule = useCallback(() => {
    setQueryBuilderJson(removeById(queryBuilderJson, id));
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const handleChange = useCallback(() => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (isOperator(node)) {
          return {
            ...node,
            combinator:
              node.combinator === CombinatorType.AND
                ? CombinatorType.OR
                : CombinatorType.AND,
          };
        }
        return node;
      })
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const actions = [
    { action: handleDeleteRule, label: "Delete" },
    { action: handleChange, label: "Change" },
  ];

  return (
    <RuleWrapper
      useLeftDragPlaceHolder
      hideHeader
      cardProps={{
        sx: cardSx(isSelected),
      }}
      node={operator}
      type={"Operator"}
      groupId={groupId}
      sortable={true}
      render={() => (
        <Box sx={rootSx(hidden)}>
          <Divider orientation="vertical" flexItem sx={dividerSx(valid)} />

          <Box />

          <Box sx={{ maxWidth: 80, mx: "auto" }}>
            <Chip
              sx={chipSx}
              label={combinator?.toUpperCase().replace("_", " ")}
            />
          </Box>

          {valid ? <Box /> : <InvalidRule reasons={invalidReason ?? []} />}
        </Box>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleOperator;
