"use client";

import { Box, Chip, Divider } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { OperatorType } from "@/types/rules";
import RuleWrapper from "../RuleWrapper";
import { useDaphneStore } from "@/store/useDaphneStore";
import { removeById } from "@/utils/rules";
import { cardSx, rootSx, dividerSx, chipSx } from "./RuleOperator.styles";

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
  const {
    queryBuilder: { queryBuilderJson, setQueryBuilderJson },
  } = useDaphneStore();

  const handleDeleteRule = () => {
    setQueryBuilderJson(removeById(queryBuilderJson, id));
  };

  const actions = [{ action: handleDeleteRule, label: "Delete" }];

  return (
    <RuleWrapper
      useLeftDragPlaceHolder
      hideHeader
      cardProps={{ sx: cardSx }}
      id={id}
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
