"use client";

import { Box, Chip, Divider } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { OperatorType } from "@/types/rules";
import RuleWrapper from "../RuleWrapper";

interface RuleOperatorProps {
  operator: OperatorType;
  sortable?: boolean;
  hidden?: boolean;
}

const RuleOperator = ({
  operator,
  sortable = true,
  hidden = false,
}: RuleOperatorProps) => {
  const { id, combinator, valid = true } = operator;

  return (
    <RuleWrapper
      id={id}
      sortable={sortable}
      render={(ref) => (
        <Box
          ref={ref}
          sx={{
            mx: "auto",
            width: "fit-content",
            pt: 1,
            minWidth: 80,
          }}
        >
          <Box
            sx={{
              minHeight: 80,
              position: "relative",
              display: hidden ? "none" : "grid",
              gridTemplateColumns: "1fr 2fr 1fr",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={(theme) => ({
                position: "absolute",
                top: 0,
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                borderLeftWidth: 2,
                zIndex: 0,
                borderColor: valid
                  ? theme.palette.divider
                  : theme.palette.warning.main,
              })}
            />

            <Box />

            <Chip
              sx={(theme) => ({
                position: "relative",
                bgcolor: "white",
                boxShadow: theme.shadows[2],
                zIndex: 1, // keep above the divider
              })}
              label={combinator?.toUpperCase()}
            />

            {valid ? (
              <Box />
            ) : (
              <WarningAmberIcon fontSize="small" color="warning" />
            )}
          </Box>
        </Box>
      )}
    />
  );
};

export default RuleOperator;
