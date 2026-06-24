"use client";

import * as React from "react";
import { ClickAwayListener, Collapse, Stack, Tooltip } from "@mui/material";
import { SingleSidedOperator, BETWEEN_OPERATOR, ValueAsNumberOperator } from "@/types/rules";
import CircularIconButton from "@/components/CircularIconButton";

const OPERATOR_LABELS: Record<ValueAsNumberOperator, string> = {
  [SingleSidedOperator.GREATER_THAN]: "≥",
  [SingleSidedOperator.LESS_THAN]: "<",
  [BETWEEN_OPERATOR]: "↔",
};

const OPERATOR_ORDER: ValueAsNumberOperator[] = [
  SingleSidedOperator.GREATER_THAN,
  SingleSidedOperator.LESS_THAN,
  BETWEEN_OPERATOR,
];

interface ValueOperatorToggleProps {
  operator: ValueAsNumberOperator;
  onChange: (op: ValueAsNumberOperator) => void;
  readOnly?: boolean;
  onClick?: () => void;
}

const ValueOperatorToggle = ({
  operator,
  onChange,
  readOnly,
  onClick,
}: ValueOperatorToggleProps) => {
  const [open, setOpen] = React.useState(false);

  const alternatives = OPERATOR_ORDER.filter((op) => op !== operator);

  const handleSelect = (
    event: React.MouseEvent<HTMLElement>,
    next: ValueAsNumberOperator,
  ) => {
    event.stopPropagation();
    onChange(next);
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Stack direction="row" gap={1} onClick={onClick}>
        <Tooltip title="Change operator" disableInteractive>
          <CircularIconButton
            disabled={!!readOnly}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Change operator"
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {OPERATOR_LABELS[operator]}
          </CircularIconButton>
        </Tooltip>
        <Collapse in={open} orientation="horizontal">
          <Stack direction="row" gap={1}>
            {alternatives.map((alt) => (
              <CircularIconButton
                key={alt}
                onClick={(e) => handleSelect(e, alt)}
              >
                {OPERATOR_LABELS[alt]}
              </CircularIconButton>
            ))}
          </Stack>
        </Collapse>
      </Stack>
    </ClickAwayListener>
  );
};

export default ValueOperatorToggle;
