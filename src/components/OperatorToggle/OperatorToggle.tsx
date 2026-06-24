"use client";

import * as React from "react";
import { ClickAwayListener, Collapse, Stack, Tooltip } from "@mui/material";
import { SingleSidedOperator, ValueAsNumberOperator } from "@/types/rules";
import CircularIconButton from "@/components/CircularIconButton";

type KnownOperator = SingleSidedOperator | ValueAsNumberOperator;

interface OperatorToggleProps<T extends KnownOperator> {
  operators: readonly T[];
  operator: T;
  onChange: (newOperator: T) => void;
  readOnly?: boolean;
  onClick?: () => void;
}

function OperatorToggle<T extends KnownOperator>({
  operators,
  operator,
  onChange,
  readOnly,
  onClick,
}: OperatorToggleProps<T>) {
  const [open, setOpen] = React.useState(false);

  const alternatives = operators.filter((op) => op !== operator);

  const handleSelect = (next: T) => {
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
            {operator}
          </CircularIconButton>
        </Tooltip>
        <Collapse in={open} orientation="horizontal">
          <Stack direction="row" gap={1}>
            {alternatives.map((alt) => (
              <CircularIconButton key={alt} onClick={() => handleSelect(alt)}>
                {alt}
              </CircularIconButton>
            ))}
          </Stack>
        </Collapse>
      </Stack>
    </ClickAwayListener>
  );
}

export default OperatorToggle;
