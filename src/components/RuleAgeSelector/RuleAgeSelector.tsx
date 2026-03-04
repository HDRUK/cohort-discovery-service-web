"use client";

import {
  FormControlLabel,
  Paper,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import { ReactNode, useMemo, useState } from "react";
import { isAgeFilter, isRuleLeaf, updateById } from "@/utils/rules";
import { AgeFilterType, RuleLeafType } from "@/types/rules";
import { CustomH1 } from "@/components/GuidanceHeaders";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import useFeatures from "@/hooks/useFeatures";
import useQueryBuilder from "@/hooks/useQueryBuilder";

import SingleBoundSelector, {
  NullablePair,
} from "@/components/SingleBoundSelector";
import { clamp } from "@/utils/numbers";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

export interface RuleAgeSelectorProps {
  children?: ReactNode;
  rule: RuleLeafType | AgeFilterType;
  title?: string;
  readOnly?: boolean;
  overrideConstrainForBunny?: boolean;
  uniDirectional?: boolean;
}

export const RuleAgeSelectorReadOnly = ({
  from,
  to,
  minAge,
  maxAge,
}: {
  from: number;
  to: number;
  minAge: number;
  maxAge: number;
}) => {
  let label: string;

  if (from === minAge && to === maxAge) {
    label = "Any age";
  } else if (from === minAge) {
    label = `Age < ${to}`;
  } else if (to === maxAge) {
    label = `Age ≥ ${from}`;
  } else {
    label = `Age ${from} - ${to}`;
  }

  return (
    <Paper
      sx={{
        border: 1,
        p: 1,
      }}
    >
      {label}
    </Paper>
  );
};

const RuleAgeSelector = ({
  rule,
  title,
  children,
  overrideConstrainForBunny = false,
  uniDirectional = false,
  readOnly = false,
}: RuleAgeSelectorProps) => {
  const minAge = MIN_AGE_FILTER;
  const maxAge = MAX_AGE_FILTER;

  const {
    queryBuilderJson,
    setQueryBuilderJson,
    setSelectedGuidance,
    selected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    setSelectedGuidance: qb.setSelectedGuidance,
    selected: qb.selected,
  }));

  const flags = useFeatures();
  const { constrainForBunnyV1 } = flags;

  const values = isRuleLeaf(rule) ? rule.ageConstraint : rule.value;

  const from = values?.[0] ?? minAge;
  const to = values?.[1] ?? maxAge;

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
        if (isAgeFilter(node)) {
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

  const ageConstraint: NullablePair<number> = useMemo(() => {
    if (isRuleLeaf(rule)) {
      return rule.ageConstraint ?? [null, null];
    }

    const l = rule.value?.[0] ?? minAge;
    const r = rule.value?.[1] ?? maxAge;

    return [l === minAge ? null : l, r === maxAge ? null : r];
  }, [rule, minAge, maxAge]);

  if (!values) return null;

  const key = collapsibleGuidanceKey("RuleAgeSelector", selected);

  if (constrainForBunnyV1 && !overrideConstrainForBunny) {
    return (
      <>
        {title && <CustomH1>{title}</CustomH1>}

        <SingleBoundSelector<number>
          constraint={ageConstraint}
          readOnly={readOnly}
          anyLabel="Any age"
          onConstraintChange={(next) => {
            setSelectedGuidance(key, true);

            setQueryBuilderJson(
              updateById(queryBuilderJson, rule.id, (node) => {
                const left =
                  next[0] == null ? null : clamp(next[0], minAge, maxAge);
                const right =
                  next[1] == null ? null : clamp(next[1], minAge, maxAge);

                if (isRuleLeaf(node)) {
                  return {
                    ...node,
                    ageConstraint: [
                      left != null && left > minAge ? left : null,
                      right != null && right < maxAge ? right : null,
                    ],
                  };
                }

                if (isAgeFilter(node)) {
                  if (left != null) return { ...node, value: [left, maxAge] };
                  if (right != null) return { ...node, value: [minAge, right] };
                  return { ...node, value: [minAge, maxAge] };
                }

                return node;
              }),
            );
          }}
          renderPicker={({ value, onChange }) => (
            <FormControlLabel
              sx={{ m: 0 }}
              control={
                <TextField
                  size="small"
                  type="number"
                  value={value ?? ""}
                  slotProps={{
                    htmlInput: { min: minAge, max: maxAge },
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return onChange(null);

                    const n = Number(raw);
                    if (Number.isNaN(n)) return;

                    onChange(clamp(n, minAge, maxAge));
                  }}
                />
              }
              slotProps={{ typography: { sx: { mx: 1 } } }}
              label="Years"
            />
          )}
          renderReadOnlyLabel={() => (
            <RuleAgeSelectorReadOnly
              to={to}
              from={from}
              minAge={minAge}
              maxAge={maxAge}
            />
          )}
        />
        {children}
      </>
    );
  }

  return (
    <>
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
                },
              }}
              sx={{ width: "20ch" }}
            />
            <Slider
              value={sliderValue}
              min={minAge}
              max={maxAge}
              onChange={(_e, newValue, activeThumb) => {
                const next = newValue as number[];

                const nextRange: [number, number] = uniDirectional
                  ? activeThumb === 0
                    ? [next[0], maxAge]
                    : [minAge, next[1]]
                  : [next[0], next[1]];

                setDraftAge(nextRange);
              }}
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
                },
              }}
              sx={{ width: "20ch" }}
            />
          </>
        )}
      </Stack>
    </>
  );
};

export default RuleAgeSelector;
