"use client";

import { Box, Chip, Divider } from "@mui/material";
import { OperatorType } from "@/types/rules";
import RuleWrapper from "../RuleWrapper";
import useQueryBuilder from "@/store/useQueryBuilder";
import { cardSx, rootSx, dividerSx, chipSx } from "./RuleOperator.styles";
import InvalidRule from "@/components/InvalidRule";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";

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

  const { isSelected } = useQueryBuilder((qb) => ({
    isSelected: !!qb.selected[id],
  }));

  const actions = useNodeActions(operator);

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
