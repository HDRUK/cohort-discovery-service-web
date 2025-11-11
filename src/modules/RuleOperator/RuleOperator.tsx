"use client";

import { Box, Chip, Divider } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { CombinatorType, OperatorType } from "@/types/rules";
import RuleWrapper from "../RuleWrapper";
import { useDaphneStore } from "@/store/useDaphneStore";
import { isOperator, removeById, updateById } from "@/utils/rules";
import { cardSx, rootSx, dividerSx, chipSx } from "./RuleOperator.styles";
import { useCallback } from "react";

export interface RuleOperatorProps {
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
  const { id, combinator, valid = true } = operator;

  const queryBuilderJson = useDaphneStore(
    (s) => s.queryBuilder.queryBuilderJson
  );
  const setQueryBuilderJson = useDaphneStore(
    (s) => s.queryBuilder.setQueryBuilderJson
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
      cardProps={{ sx: cardSx }}
      node={operator}
      type={"Operator"}
      groupId={groupId}
      sortable={true}
      render={() => (
        <Box sx={rootSx(hidden)}>
          <Divider orientation="vertical" flexItem sx={dividerSx(valid)} />

          <Box />

          <Chip
            sx={chipSx}
            label={combinator?.toUpperCase().replace("_", " ")}
          />

          {valid ? (
            <Box />
          ) : (
            <WarningAmberIcon fontSize="small" color="warning" />
          )}
        </Box>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleOperator;
