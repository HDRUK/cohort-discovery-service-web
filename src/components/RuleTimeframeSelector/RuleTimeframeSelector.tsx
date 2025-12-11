"use client";

import { Paper, Stack, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { ReactNode, useMemo } from "react";
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

export interface RuleTimeframeSelectorProps extends DatePickerProps {
  children?: ReactNode;
  rule: RuleLeafType;
  title?: string;
}

type BunnyOperator = "gt" | "lt";

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
    selected: qb.selected,
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const { constrainForBunnyV1 } = useFeatures();

  const [leftValue, rightValue] = useMemo<[Dayjs | null, Dayjs | null]>(() => {
    const [start, end] = rule.timeConstraint ?? [null, null];
    return [start ? dayjs(start) : null, end ? dayjs(end) : null];
  }, [rule.timeConstraint]);

  const { operator, singleDate } = useMemo<{
    operator: BunnyOperator;
    singleDate: Dayjs | null;
  }>(() => {
    const [start, end] = rule.timeConstraint ?? [null, null];

    if (start && !end) {
      return { operator: "gt", singleDate: dayjs(start) };
    }

    if (!start && end) {
      return { operator: "lt", singleDate: dayjs(end) };
    }

    if (start) {
      return { operator: "gt", singleDate: dayjs(start) };
    }
    if (end) {
      return { operator: "lt", singleDate: dayjs(end) };
    }

    return { operator: "gt", singleDate: null };
  }, [rule.timeConstraint]);

  const handleLeftChange = (value: PickerValue) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        return {
          ...node,
          timeConstraint: [
            value?.toISOString() ?? null,
            rightValue?.toISOString() ?? null,
          ],
        };
      })
    );
  };

  const handleRightChange = (value: PickerValue) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        return {
          ...node,
          timeConstraint: [
            leftValue?.toISOString() ?? null,
            value?.toISOString() ?? null,
          ],
        };
      })
    );
  };

  const handlOperatorChange = (
    _e: React.MouseEvent<HTMLElement>,
    nextOperator: BunnyOperator | null
  ) => {
    if (!nextOperator) return;

    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        const dateIso = singleDate?.toISOString() ?? null;

        return {
          ...node,
          timeConstraint:
            nextOperator === "gt" ? [dateIso, null] : [null, dateIso],
        };
      })
    );
  };

  const handleSingleDateChange = (value: PickerValue) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        const dateIso = value?.toISOString() ?? null;

        return {
          ...node,
          timeConstraint: operator === "gt" ? [dateIso, null] : [null, dateIso],
        };
      })
    );
  };

  if (!rule.timeConstraint) return null;

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

  if (constrainForBunnyV1) {
    return (
      <>
        {title && <CustomH1>{title}</CustomH1>}
        <Stack direction="row" spacing={2} alignItems="center">
          {readOnly ? (
            <Paper sx={{ border: 1, p: 1 }}>
              {singleDate
                ? `${capitaliseFirstLetter(verb)} ${
                    operator === "gt" ? "after" : "before"
                  } ${singleDate.format("MM-YYYY")}`
                : `${capitaliseFirstLetter(verb)} at any time`}
            </Paper>
          ) : (
            <>
              <ToggleButtonGroup
                exclusive
                size="small"
                value={operator}
                onChange={handlOperatorChange}
                disabled={!!readOnly}
              >
                <ToggleButton value="gt">{">"}</ToggleButton>
                <ToggleButton value="lt">{"<"}</ToggleButton>
              </ToggleButtonGroup>
              <DatePicker
                {...commonPickerProps}
                value={singleDate}
                onChange={handleSingleDateChange}
              />
            </>
          )}
        </Stack>
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
