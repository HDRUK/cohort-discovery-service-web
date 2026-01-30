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

  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const flags = useFeatures();
  const { constrainForBunnyV1 } = flags;

  const values = isRuleLeaf(rule) ? rule.ageConstraint : rule.value;

  const from = values?.[0] ?? minAge;
  const to = values?.[1] ?? maxAge;

  const committedAge = useMemo<[number, number]>(() => [from, to], [from, to]);

  const [draftAge, setDraftAge] = useState<[number, number] | null>(null);

  const sliderValue = draftAge ?? committedAge;

  const handleCommitChange = () => {
    const [l, r] = draftAge ?? committedAge;
    setDraftAge(null);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (isRuleLeaf(node)) {
          return {
            ...node,
            ageConstraint: [l > minAge ? l : null, r < maxAge ? r : null],
          };
        }
        if (isAgeFilter(node)) {
          return { ...node, value: [l, r] };
        }
        return node;
      }),
    );
  };

  const ageConstraint: NullablePair<number> = useMemo(() => {
    if (isRuleLeaf(rule)) {
      return rule.ageConstraint ?? [null, null];
    }

    const l = rule.value?.[0] ?? minAge;
    const r = rule.value?.[1] ?? maxAge;

    return [l === minAge ? null : l, r === maxAge ? null : r];
  }, [rule, minAge, maxAge]);

  const marks = useMemo(() => {
    const bins = 5;
    const range = maxAge - minAge;
    const step = range / (bins - 1);

    return Array.from({ length: bins }, (_, i) => {
      const value = Math.round(minAge + step * i);
      return { value, label: value };
    });
  }, [minAge, maxAge]);

  if (!values) return null;

  if (constrainForBunnyV1 && !overrideConstrainForBunny) {
    return (
      <>
        {title && <CustomH1>{title}</CustomH1>}

        <SingleBoundSelector<number>
          constraint={ageConstraint}
          readOnly={readOnly}
          anyLabel="Any age"
          onConstraintChange={(next) => {
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
      <Stack direction="column" spacing={2} alignItems="center" paddingX={2}>
        {readOnly ? (
          <RuleAgeSelectorReadOnly
            to={to}
            from={from}
            minAge={minAge}
            maxAge={maxAge}
          />
        ) : (
          <Slider
            value={sliderValue}
            min={minAge}
            max={maxAge}
            marks={marks}
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
        )}
      </Stack>
    </>
  );
};

export default RuleAgeSelector;
