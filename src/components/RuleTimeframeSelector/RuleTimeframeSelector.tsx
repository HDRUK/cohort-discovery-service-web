"use client";

import { ReactNode, useCallback } from "react";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { updateById } from "@/utils/rules";
import { RuleLeafType, SingleSidedOperator } from "@/types/rules";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  DatePickerProps,
  DatePickerSlotProps,
} from "@mui/x-date-pickers/DatePicker";
import { CustomH1 } from "@/components/GuidanceHeaders";
import useFeatures from "@/hooks/useFeatures";
import { getDomainVerbs } from "@/utils/omop";
import { capitaliseFirstLetter } from "@/utils/string";

import SingleBoundSelector from "@/components/SingleBoundSelector";
import DoubleBoundSelector from "@/components/DoubleBoundSelector";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";
import HoverableDiv from "@/components/HoverableDiv";

export interface RuleTimeframeSelectorProps extends DatePickerProps {
  children?: ReactNode;
  rule: RuleLeafType;
  title?: string;
  flex?: boolean;
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
  flex = false,
  ...props
}: RuleTimeframeSelectorProps) => {
  const {
    queryBuilderJson,
    setQueryBuilderJson,
    setSelectedGuidance,
    selected,
    setSelected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    setSelectedGuidance: qb.setSelectedGuidance,
    selected: qb.selected,
    setSelected: qb.setSelected,
  }));

  const { constrainForBunnyV1 } = useFeatures();

  const key = collapsibleGuidanceKey("RuleTimeframeSelector", selected);

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
    [],
  );

  const serialiseDayjsToIso = useCallback(
    (d: Dayjs | null) => (d ? d.toISOString() : null),
    [],
  );

  if (!rule.timeConstraint) return null;

  if (constrainForBunnyV1) {
    return (
      <HoverableDiv
        hoverKey={`rule-timeframe-${rule.id}`}
        onClick={() => setSelected(rule.id)}
        flex={flex}
      >
        {title && <CustomH1>{title}</CustomH1>}

        <SingleBoundSelector<string, Dayjs>
          constraint={rule.timeConstraint ?? []}
          constraintOperator={
            rule.timeConstraintOperator ?? SingleSidedOperator.GREATER_THAN
          }
          onConstraintChange={(next, nextOperator) => {
            setSelectedGuidance(key, true);
            setQueryBuilderJson(
              updateById(queryBuilderJson, rule.id, (node) => ({
                ...node,
                timeConstraint: next,
                timeConstraintOperator: nextOperator,
              })),
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
      </HoverableDiv>
    );
  }

  return (
    <HoverableDiv
      hoverKey={`rule-timeframe-${rule.id}`}
      onClick={() => setSelected(rule.id)}
      flex={flex}
    >
      {title && <CustomH1>{title}</CustomH1>}
      <DoubleBoundSelector
        rule={rule}
        commonPickerProps={commonPickerProps}
        guidanceKey={key}
      />
      {children}
    </HoverableDiv>
  );
};

export default RuleTimeframeSelector;
