"use client";

import { Box, Chip, Divider } from "@mui/material";
import { OperatorType } from "@/types/rules";
import RuleWrapper from "../RuleWrapper";
import { rootSx, dividerSx, chipSx } from "./RuleOperator.styles";
import InvalidRule from "@/components/InvalidRule";

export interface RuleOperatorProps {
  operator: OperatorType;
  groupId?: string;
  hidden?: boolean;
}

const RuleOperator = ({
  operator,
  groupId,
  hidden = false,
}: RuleOperatorProps) => {
  const { combinator, valid = true, invalidReason } = operator;

  return (
    <RuleWrapper
      node={operator}
      groupId={groupId}
      renderHeader={null}
      renderContent={
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
      }
    />
  );
};

export default RuleOperator;
