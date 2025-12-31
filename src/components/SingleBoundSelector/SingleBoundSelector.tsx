"use client";

import { Paper, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ReactNode, useMemo } from "react";

export enum SingleSidedOperator {
  GREATER_THAN = "gt",
  LESS_THAN = "lt",
}

export type NullablePair<T> = [T | null, T | null];

type ReadOnlyLabelArgs<TUi> = {
  operator: SingleSidedOperator;
  value: TUi | null;
};

export type SingleBoundSelectorProps<TStored, TUi> = {
  title?: ReactNode;
  children?: ReactNode;

  constraint: NullablePair<TStored>;

  onConstraintChange: (next: NullablePair<TStored>) => void;

  parse?: (stored: TStored | null) => TUi | null;

  serialise?: (ui: TUi | null) => TStored | null;

  readOnly?: boolean;

  operatorLabelOverrides?: Map<SingleSidedOperator, ReactNode | string>;

  renderPicker: (args: {
    value: TUi | null;
    onChange: (value: TUi | null) => void;
    readOnly?: boolean;
  }) => ReactNode;

  renderReadOnlyLabel?: (args: ReadOnlyLabelArgs<TUi>) => ReactNode;

  anyLabel?: string;
};

function deriveOperatorAndValue<TStored, TUi>(
  constraint: NullablePair<TStored>,
  parse: (stored: TStored | null) => TUi | null
): { operator: SingleSidedOperator; value: TUi | null } {
  const [left, right] = constraint;

  if (left != null && right == null)
    return { operator: SingleSidedOperator.GREATER_THAN, value: parse(left) };
  if (left == null && right != null)
    return { operator: SingleSidedOperator.LESS_THAN, value: parse(right) };

  if (left != null)
    return { operator: SingleSidedOperator.GREATER_THAN, value: parse(left) };
  if (right != null)
    return { operator: SingleSidedOperator.LESS_THAN, value: parse(right) };

  return { operator: SingleSidedOperator.GREATER_THAN, value: null };
}

export default function SingleBoundSelector<TStored, TUi>({
  title,
  children,
  constraint,
  onConstraintChange,
  parse,
  serialise,
  readOnly,
  anyLabel = "Any time",
  operatorLabelOverrides,
  renderPicker,
  renderReadOnlyLabel,
}: SingleBoundSelectorProps<TStored, TUi>) {
  const parseFn = useMemo(
    () => parse ?? ((v: TStored | null) => v as unknown as TUi | null),
    [parse]
  );

  const serialiseFn = useMemo(
    () => serialise ?? ((v: TUi | null) => v as unknown as TStored | null),
    [serialise]
  );

  const { operator, value } = useMemo(
    () => deriveOperatorAndValue(constraint, parseFn),
    [parseFn, constraint]
  );

  const handleOperatorChange = (
    _e: React.MouseEvent<HTMLElement>,
    nextOperator: SingleSidedOperator | null
  ) => {
    if (!nextOperator) return;

    const stored = serialiseFn(value);
    onConstraintChange(
      nextOperator === SingleSidedOperator.GREATER_THAN
        ? [stored, null]
        : [null, stored]
    );
  };

  const handleValueChange = (nextValue: TUi | null) => {
    const stored = serialiseFn(nextValue);
    onConstraintChange(
      operator === SingleSidedOperator.GREATER_THAN
        ? [stored, null]
        : [null, stored]
    );
  };

  const greaterThanLabel =
    operatorLabelOverrides?.get(SingleSidedOperator.GREATER_THAN) ?? ">";
  const lessThanLabel =
    operatorLabelOverrides?.get(SingleSidedOperator.LESS_THAN) ?? "<";

  return (
    <>
      {title}
      <Stack direction="row" spacing={2} alignItems="center">
        {readOnly ? (
          <Paper sx={{ border: 1, p: 1 }}>
            {renderReadOnlyLabel
              ? renderReadOnlyLabel({ operator, value })
              : value == null
              ? anyLabel
              : operator === SingleSidedOperator.GREATER_THAN
              ? `${greaterThanLabel} ${String(value)}`
              : `${lessThanLabel} ${String(value)}`}
          </Paper>
        ) : (
          <>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={operator}
              onChange={handleOperatorChange}
              disabled={!!readOnly}
            >
              <ToggleButton value={SingleSidedOperator.GREATER_THAN}>
                {greaterThanLabel}
              </ToggleButton>
              <ToggleButton value={SingleSidedOperator.LESS_THAN}>
                {lessThanLabel}
              </ToggleButton>
            </ToggleButtonGroup>

            {renderPicker({
              value,
              onChange: handleValueChange,
              readOnly,
            })}
          </>
        )}
      </Stack>
      {children}
    </>
  );
}
