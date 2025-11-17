"use client";

import { Stack } from "@mui/material";
import { useMemo } from "react";
import useQueryBuilder from "@/store/useQueryBuilder";
import { updateById } from "@/utils/rules";
import { RuleNodeType } from "@/types/rules";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  DatePickerProps,
  DatePickerSlotProps,
} from "@mui/x-date-pickers/DatePicker";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { CustomH1 } from "@/components/GuidanceHeaders";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export interface RuleTimeframeSelectorProps extends DatePickerProps {
  rule: RuleNodeType;
  title?: string;
}

const RuleTimeframeSelector = ({
  rule,
  title,
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

  const [leftValue, rightValue] = useMemo<[Dayjs | null, Dayjs | null]>(() => {
    const [start, end] = rule.timeConstraint ?? [null, null];
    return [start ? dayjs(start) : null, end ? dayjs(end) : null];
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

  if (!rule.timeConstraint) return null;

  const mergedSlotProps: DatePickerSlotProps<false> = {
    ...slotProps,
    textField: {
      ...slotProps?.textField,
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
    </>
  );
};

export default RuleTimeframeSelector;
