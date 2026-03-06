"use client";

import { Stack } from "@mui/material";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useMemo } from "react";
import dayjs, { Dayjs } from "dayjs";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { RuleLeafType } from "@/types/rules";
import { PickerValue } from "@mui/x-date-pickers/internals";
import { updateById } from "@/utils/rules";

export default function DoubleBoundSelector({
  rule,
  commonPickerProps,
  guidanceKey,
}: {
  rule: RuleLeafType;
  commonPickerProps: DatePickerProps;
  guidanceKey: string;
}) {
  const { queryBuilderJson, setQueryBuilderJson, setSelectedGuidance } =
    useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      setSelectedGuidance: qb.setSelectedGuidance,
    }));

  const [leftValue, rightValue] = useMemo<[Dayjs | null, Dayjs | null]>(() => {
    const [start, end] = rule.timeConstraint ?? [null, null];
    return [start ? dayjs(start) : null, end ? dayjs(end) : null];
  }, [rule.timeConstraint]);

  const handleLeftChange = (value: PickerValue) => {
    setSelectedGuidance(guidanceKey, true);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => ({
        ...node,
        timeConstraint: [
          value?.toISOString() ?? null,
          rightValue?.toISOString() ?? null,
        ],
      })),
    );
  };

  const handleRightChange = (value: PickerValue) => {
    setSelectedGuidance(guidanceKey, true);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => ({
        ...node,
        timeConstraint: [
          leftValue?.toISOString() ?? null,
          value?.toISOString() ?? null,
        ],
      })),
    );
  };

  return (
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
  );
}
