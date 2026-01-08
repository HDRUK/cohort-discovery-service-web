"use client";

import { Stack } from "@mui/material";
import { ReactNode, useCallback, useMemo } from "react";
import useQueryBuilder from "@/store/useQueryBuilder";
import { updateById } from "@/utils/rules";
import { RuleLeafType } from "@/types/rules";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  DatePickerProps,
  DatePickerSlotProps,
} from "@mui/x-date-pickers/DatePicker";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { CustomH1 } from "@/components/GuidanceHeaders";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useFeatures from "@/store/useFeatures";
import { getDomainVerbs } from "@/utils/omop";
import { capitaliseFirstLetter } from "@/utils/string";

import SingleBoundSelector, {
  SingleSidedOperator,
} from "@/components/SingleBoundSelector";

export interface RuleTimeframeSelectorProps extends DatePickerProps {
  children?: ReactNode;
  rule: RuleLeafType;
  title?: string;
}

const RuleTimeframeSelector = ({
  rule,
  title,
  children,
  views = ["month", "year"],
  format = "MM YYYY",
  slotProps,
  readOnly,
  open,
  ...props
}: RuleTimeframeSelectorProps) => {
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const { constrainForBunnyV1 } = useFeatures();

  const [leftValue, rightValue] = useMemo<[Dayjs | null, Dayjs | null]>(() => {
    const [start, end] = rule.timeConstraint ?? [null, null];
    return [start ? dayjs(start) : null, end ? dayjs(end) : null];
  }, [rule.timeConstraint]);

  const handleLeftChange = (value: PickerValue) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => ({
        ...node,
        timeConstraint: [
          value?.toISOString() ?? null,
          rightValue?.toISOString() ?? null,
        ],
      }))
    );
  };

  const handleRightChange = (value: PickerValue) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => ({
        ...node,
        timeConstraint: [
          leftValue?.toISOString() ?? null,
          value?.toISOString() ?? null,
        ],
      }))
    );
  };

  const mergedSlotProps: DatePickerSlotProps<false> = {
    ...slotProps,
    textField: {
      ...slotProps?.textField,
      size: "small",
      sx: {
        backgroundColor: "white",
        width: readOnly ? 120 : 150,
        borderRadius: 1,
        ...(readOnly ? { pointerEvents: "none" as const } : {}),
      },
    },
  };

  const commonPickerProps: DatePickerProps = {
    ...props,
    views,
    format,
    slotProps: mergedSlotProps,
    readOnly,
    open: readOnly ? false : open,
    disableOpenPicker: readOnly ? true : false,
  };

  const { verb } = rule.rule.concept?.category
    ? getDomainVerbs(rule.rule.concept?.category)
    : { verb: "" };

  const parseIsoToDayjs = useCallback(
    (iso: string | null) => (iso ? dayjs(iso) : null),
    []
  );

  const serialiseDayjsToIso = useCallback(
    (d: Dayjs | null) => (d ? d.toISOString() : null),
    []
  );

  if (!rule.timeConstraint) return null;

  if (constrainForBunnyV1) {
    return (
      <>
        {title && <CustomH1>{title}</CustomH1>}
        <SingleBoundSelector<string, Dayjs>
          constraint={rule.timeConstraint}
          onConstraintChange={(next) => {
            setQueryBuilderJson(
              updateById(queryBuilderJson, rule.id, (node) => ({
                ...node,
                timeConstraint: next,
              }))
            );
          }}
          parse={parseIsoToDayjs}
          serialise={serialiseDayjsToIso}
          readOnly={readOnly}
          anyLabel={`${capitaliseFirstLetter(verb)} at any time`}
          renderPicker={({ value, onChange }) => (
            <DatePicker
              {...commonPickerProps}
              value={value}
              onChange={(v) => onChange(v)}
            />
          )}
          renderReadOnlyLabel={({ operator, value }) =>
            value
              ? `${capitaliseFirstLetter(verb)} ${
                  operator === SingleSidedOperator.GREATER_THAN
                    ? "after"
                    : "before"
                } ${value.format("MM-YYYY")}`
              : `${capitaliseFirstLetter(verb)} at any time`
          }
        />
        {children}
      </>
    );
  }

  return (
    <>
      {title && <CustomH1>{title}</CustomH1>}
      <Stack direction="row" spacing={2} alignItems="center">
        <DatePicker
          {...commonPickerProps}
          value={leftValue}
          onChange={handleLeftChange}
        />
        <ArrowForwardIcon />
        <DatePicker
          {...commonPickerProps}
          value={rightValue}
          onChange={handleRightChange}
        />
      </Stack>
      {children}
    </>
  );
};

export default RuleTimeframeSelector;
