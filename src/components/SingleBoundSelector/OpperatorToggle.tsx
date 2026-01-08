import * as React from "react";
import { ClickAwayListener, Collapse, Stack, Tooltip } from "@mui/material";
import { SingleSidedOperator } from "./SingleBoundSelector";
import CircularIconButton from "../CircularIconButton";

interface OperatorToggleProps {
  operator: SingleSidedOperator;
  handleOperatorChange: (
    event: React.MouseEvent<HTMLElement>,
    newOperator: SingleSidedOperator
  ) => void;
  readOnly?: boolean;
  greaterThanLabel: React.ReactNode;
  lessThanLabel: React.ReactNode;
}

const OperatorToggle = ({
  operator,
  handleOperatorChange,
  readOnly,
  greaterThanLabel,
  lessThanLabel,
}: OperatorToggleProps) => {
  const [open, setOpen] = React.useState(false);

  const [currentLabel, alternativeLabel] =
    operator === SingleSidedOperator.GREATER_THAN
      ? [greaterThanLabel, lessThanLabel]
      : [lessThanLabel, greaterThanLabel];

  const onSelect = (event: React.MouseEvent<HTMLElement>) => {
    handleOperatorChange(
      event,
      operator === SingleSidedOperator.GREATER_THAN
        ? SingleSidedOperator.LESS_THAN
        : SingleSidedOperator.GREATER_THAN
    );
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Stack direction={"row"} gap={1}>
        <Tooltip title="Change operator" disableInteractive>
          <CircularIconButton
            disabled={!!readOnly}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Change operator"
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {currentLabel}
          </CircularIconButton>
        </Tooltip>
        <Collapse in={open} orientation="horizontal">
          <CircularIconButton onClick={onSelect}>
            {alternativeLabel}
          </CircularIconButton>
        </Collapse>
      </Stack>
    </ClickAwayListener>
  );
};

export default OperatorToggle;
