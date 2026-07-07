"use client";

import { ReactNode, useMemo, useState } from "react";
import { Slider, Stack, TextField } from "@mui/material";
import { isDemographicFilter, isRuleLeaf, updateById } from "@/utils/rules";
import { DemographicFilterType, RuleLeafType } from "@/types/rules";
import { CustomH1 } from "@/components/GuidanceHeaders";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import HoverableDiv from "@/components/HoverableDiv";
import RuleAgeSelectorReadOnly from "./RuleAgeSelectorReadOnly";

export interface RuleAgeSelectorSliderProps {
  rule: RuleLeafType | DemographicFilterType;
  from: number;
  to: number;
  minAge: number;
  maxAge: number;
  readOnly: boolean;
  uniDirectional: boolean;
  title?: string;
  flex: boolean;
  children?: ReactNode;
}

const RuleAgeSelectorSlider = ({
  rule,
  from,
  to,
  minAge,
  maxAge,
  readOnly,
  uniDirectional,
  title,
  flex,
  children,
}: RuleAgeSelectorSliderProps) => {
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const committedAge = useMemo<[number, number]>(() => [from, to], [from, to]);

  const [draftAge, setDraftAge] = useState<[number, number] | null>(null);

  const sliderValue = useMemo(() => {
    return draftAge ?? committedAge;
  }, [draftAge, committedAge]);

  const handleCommitChange = () => {
    const [l, r] = draftAge ?? committedAge;
    setDraftAge(null);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (isRuleLeaf(node)) {
          return {
            ...node,
            ageConstraint: [
              Math.min(l, r) > minAge ? Math.min(l, r) : null,
              Math.max(l, r) < maxAge ? Math.max(l, r) : null,
            ],
          };
        }
        if (isDemographicFilter(node)) {
          return {
            ...node,
            value: [
              Math.max(minAge, Math.min(l, r)),
              Math.min(maxAge, Math.max(l, r)),
            ],
          };
        }
        return node;
      }),
    );
  };

  const handleInputChangeLeft = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDraftAge([
      event.target.value === "" ? 0 : Number(event.target.value),
      sliderValue[1],
    ]);
  };

  const handleBlurLeft = () => {
    if (draftAge && draftAge[0] < minAge) {
      setDraftAge([minAge, draftAge[1]]);
    } else if (draftAge && draftAge[0] > maxAge) {
      setDraftAge([maxAge, maxAge]);
    } else if (draftAge && draftAge[1] < draftAge[0]) {
      setDraftAge([draftAge[1], draftAge[0]]);
    }
    handleCommitChange();
  };

  const handleInputChangeRight = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDraftAge([
      sliderValue[0],
      event.target.value === "" ? 0 : Number(event.target.value),
    ]);
  };

  const handleBlurRight = () => {
    if (draftAge && draftAge[1] < minAge) {
      setDraftAge([minAge, minAge]);
    } else if (draftAge && draftAge[1] > maxAge) {
      setDraftAge([draftAge[0], maxAge]);
    } else if (draftAge && draftAge[1] < draftAge[0]) {
      setDraftAge([draftAge[1], draftAge[0]]);
    }
    handleCommitChange();
  };

  const handleSliderChange = (
    _e: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    const next = newValue as number[];

    const nextRange: [number, number] = uniDirectional
      ? activeThumb === 0
        ? [next[0], maxAge]
        : [minAge, next[1]]
      : [next[0], next[1]];

    setDraftAge(nextRange);
  };

  return (
    <HoverableDiv
      stopPropagation={!readOnly}
      hoverKey={`rule-age-${rule.id}`}
      flex={flex}
    >
      {title && <CustomH1>{title}</CustomH1>}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        justifyItems="space-between"
        paddingY={2}
      >
        {readOnly ? (
          <RuleAgeSelectorReadOnly
            to={to}
            from={from}
            minAge={minAge}
            maxAge={maxAge}
          />
        ) : (
          <>
            <TextField
              value={sliderValue[0]}
              size="small"
              onChange={handleInputChangeLeft}
              onBlur={handleBlurLeft}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBlurLeft();
                }
              }}
              slotProps={{
                htmlInput: {
                  step: 1,
                  min: minAge,
                  max: maxAge,
                  type: "number",
                  "aria-labelledby": "input-slider",
                  sx: { p: 0.5 },
                },
              }}
              sx={{
                maxWidth: "7ch",
                flexShrink: 0,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            <Slider
              value={sliderValue}
              min={minAge}
              max={maxAge}
              onChange={handleSliderChange}
              onChangeCommitted={handleCommitChange}
            />
            <TextField
              value={sliderValue[1]}
              size="small"
              onChange={handleInputChangeRight}
              onBlur={handleBlurRight}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleBlurRight();
                }
              }}
              slotProps={{
                htmlInput: {
                  step: 1,
                  min: minAge,
                  max: maxAge,
                  type: "number",
                  "aria-labelledby": "input-slider",
                  sx: { p: 0.5 },
                },
              }}
              sx={{
                maxWidth: "7ch",
                flexShrink: 0,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
          </>
        )}
      </Stack>
      {children}
    </HoverableDiv>
  );
};

export default RuleAgeSelectorSlider;
