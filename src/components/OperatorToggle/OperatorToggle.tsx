"use client";

import * as React from "react";
import { ClickAwayListener, Collapse, Stack, Tooltip } from "@mui/material";
import CircularIconButton from "@/components/CircularIconButton";

interface OperatorToggleProps<T extends string> {
  operator: T;
  operators: T[];
  operatorLabels: Record<T, React.ReactNode>;
  handleOperatorChange: (
    event: React.MouseEvent<HTMLElement>,
    newOperator: T,
  ) => void;
  readOnly?: boolean;
  onClick?: () => void;
}

function OperatorToggle<T extends string>({
  operator,
  operators,
  operatorLabels,
  handleOperatorChange,
  readOnly,
  onClick,
}: OperatorToggleProps<T>) {
  const [open, setOpen] = React.useState(false);

  const alternatives = operators.filter((op) => op !== operator);

  const handleSelect = (event: React.MouseEvent<HTMLElement>, next: T) => {
    event.stopPropagation();
    handleOperatorChange(event, next);
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
            {operatorLabels[operator]}
          </CircularIconButton>
        </Tooltip>
        <Collapse in={open} orientation="horizontal">
          <Stack direction="row" gap={1}>
            {alternatives.map((alt) => (
              <CircularIconButton
                key={alt}
                onClick={(e) => handleSelect(e, alt)}
              >
                {operatorLabels[alt]}
              </CircularIconButton>
            ))}
          </Stack>
        </Collapse>
      </Stack>
    </ClickAwayListener>
  );
}

export default OperatorToggle;
