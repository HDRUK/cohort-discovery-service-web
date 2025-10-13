"use client";

import { Box, Chip, Divider } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { OperatorType } from "@/types/rules";
import RuleWrapper from "../RuleWrapper";
import { useDaphneStore } from "@/store/useDaphneStore";
import { removeById } from "@/utils/rules";

export interface RuleOperatorProps {
  operator: OperatorType;
  groupId: string;
  hidden?: boolean;
}

const RuleOperator = ({
  operator,
  groupId,
  hidden = false,
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
      hideHeader
      cardProps={{
        sx: {
          border: 0,
          mx: "auto",
          width: "fit-content",
          pt: 1,
          minWidth: 80,
          bgcolor: "transparent",
        },
      }}
      id={id}
      type={"Operator"}
      groupId={groupId}
      sortable={true}
      render={() => (
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
    />
  );
};

export default RuleOperator;
