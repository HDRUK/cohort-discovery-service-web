"use client";

import { Paper, Stack } from "@mui/material";
import { ReactNode, useMemo } from "react";
import { ValueAsNumberOperator } from "@/types/rules";

import OperatorToggle from "@/components/OperatorToggle";

export type NullablePair<T> = [T | null, T | null];

type ReadOnlyLabelArgs<TUi> = {
  operator: ValueAsNumberOperator;
  value: TUi | null;
};

export type SingleBoundSelectorProps<TStored, TUi = TStored> = {
  title?: ReactNode;
  children?: ReactNode;

  constraint: NullablePair<TStored>;

  constraintOperator: ValueAsNumberOperator;

  onConstraintChange: (
    next: NullablePair<TStored>,
    nextOperator: ValueAsNumberOperator,
  ) => void;

  parse?: (stored: TStored | null) => TUi | null;

  serialise?: (ui: TUi | null) => TStored | null;

  readOnly?: boolean;

  renderPicker: (args: {
    value: TUi | null;
    onChange: (value: TUi | null) => void;
    readOnly?: boolean;
  }) => ReactNode;

  renderReadOnlyLabel?: (args: ReadOnlyLabelArgs<TUi>) => ReactNode;

  anyLabel?: string;

  onClick?: () => void;
};

function deriveOperatorAndValue<TStored, TUi>(
  constraint: NullablePair<TStored>,
  parse: (stored: TStored | null) => TUi | null,
  constraintOperator: ValueAsNumberOperator,
): { operator: ValueAsNumberOperator; value: TUi | null } {
  const [left, right] = constraint;

  if (left != null && right == null)
    return { operator: ValueAsNumberOperator.GREATER_THAN, value: parse(left) };
  if (left == null && right != null)
    return { operator: ValueAsNumberOperator.LESS_THAN, value: parse(right) };

  if (left != null)
    return { operator: ValueAsNumberOperator.GREATER_THAN, value: parse(left) };
  if (right != null)
    return { operator: ValueAsNumberOperator.LESS_THAN, value: parse(right) };

  return { operator: constraintOperator, value: null };
}

export default function SingleBoundSelector<TStored, TUi = TStored>({
  title,
  children,
  constraint,
  constraintOperator,
  onConstraintChange,
  parse,
  serialise,
  readOnly,
  anyLabel = "Any time",
  renderPicker,
  renderReadOnlyLabel,
  onClick,
}: SingleBoundSelectorProps<TStored, TUi>) {
  const parseFn = useMemo(
    () => parse ?? ((v: TStored | null) => v as unknown as TUi | null),
    [parse],
  );

  const serialiseFn = useMemo(
    () => serialise ?? ((v: TUi | null) => v as unknown as TStored | null),
    [serialise],
  );

  const { operator, value } = useMemo(
    () => deriveOperatorAndValue(constraint, parseFn, constraintOperator),
    [parseFn, constraint, constraintOperator],
  );

  const handleOperatorChange = (nextOperator: ValueAsNumberOperator) => {
    const stored = serialiseFn(value);
    onConstraintChange(
      nextOperator === ValueAsNumberOperator.GREATER_THAN
        ? [stored, null]
        : [null, stored],
      nextOperator,
    );
  };

  const handleValueChange = (nextValue: TUi | null) => {
    const stored = serialiseFn(nextValue);
    onConstraintChange(
      operator === ValueAsNumberOperator.GREATER_THAN
        ? [stored, null]
        : [null, stored],
      operator,
    );
  };

  return (
    <>
      {title}
      <Stack direction="row" spacing={2} alignItems="center">
        {readOnly ? (
          (() => {
            if (renderReadOnlyLabel) {
              const rendered = renderReadOnlyLabel({ operator, value });

              return typeof rendered === "string" ? (
                <Paper sx={{ border: 1, p: 1 }}>{rendered}</Paper>
              ) : (
                <>{rendered}</>
              );
            }

            const defaultText =
              value == null
                ? anyLabel
                : `${operator} ${String(value)}`;

            return <Paper sx={{ border: 1, p: 1 }}>{defaultText}</Paper>;
          })()
        ) : (
          <Stack direction={"row"} gap={1} alignItems={"center"}>
            <OperatorToggle
              operators={[ValueAsNumberOperator.GREATER_THAN, ValueAsNumberOperator.LESS_THAN]}
              operator={operator}
              onChange={handleOperatorChange}
              readOnly={readOnly}
              onClick={onClick}
            />

            {renderPicker({
              value,
              onChange: handleValueChange,
              readOnly,
            })}
          </Stack>
        )}
      </Stack>
      {children}
    </>
  );
}
