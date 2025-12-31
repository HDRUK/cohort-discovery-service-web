"use client";

import { Paper, Slider, Stack } from "@mui/material";
import { ReactNode, useState } from "react";
import useQueryBuilder from "@/store/useQueryBuilder";
import { isAgeFilter, isRuleLeaf, updateById } from "@/utils/rules";
import { AgeFilterType, RuleLeafType } from "@/types/rules";
import { CustomH1 } from "@/components/GuidanceHeaders";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import useFeatures from "@/store/useFeatures";

export interface RuleAgeSelectorProps {
  children?: ReactNode;
  rule: RuleLeafType | AgeFilterType;
  title?: string;
  readOnly?: boolean;
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
    label = `Age > ${from}`;
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
  uniDirectional = false,
  readOnly = false,
}: RuleAgeSelectorProps) => {
  const minAge = MIN_AGE_FILTER;
  const maxAge = MAX_AGE_FILTER;
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    selected: qb.selected,
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));
  const { constrainForBunnyV1 } = useFeatures();

  const values = isRuleLeaf(rule) ? rule.ageConstraint : rule.value;

  const from = values?.[0] ?? minAge;
  const to = values?.[1] ?? maxAge;

  const [age, setAge] = useState<number[]>([from, to]);

  const handleCommitChange = () => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (isRuleLeaf(node)) {
          return {
            ...node,
            ageConstraint: [
              age[0] > minAge ? age[0] : null,
              age[1] < maxAge ? age[1] : null,
            ],
          };
        } else if (isAgeFilter(node)) {
          return {
            ...node,
            value: [age[0] ?? minAge, age[1] ?? maxAge],
          };
        }
        return node;
      })
    );
  };

  if (!values) return null;

  if (readOnly) {
    return (
      <RuleAgeSelectorReadOnly
        to={to}
        from={from}
        minAge={minAge}
        maxAge={maxAge}
      />
    );
  }

  return (
    <>
      {title && <CustomH1>{title}</CustomH1>}
      <Stack direction="column" spacing={2} alignItems="center" padding={2}>
        {constrainForBunnyV1 ? (
          <>hi</>
        ) : (
          <Slider
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onChangeCommitted={(_e) => {
              handleCommitChange();
            }}
            value={age}
            min={minAge}
            max={maxAge}
            onChange={(_e, newValue, activeThumb) => {
              if (uniDirectional) {
                if (activeThumb === 0) {
                  setAge([newValue[0], maxAge]);
                } else {
                  setAge([minAge, newValue[1]]);
                }
              } else {
                setAge(newValue);
              }
            }}
            valueLabelDisplay="auto"
          />
        )}
        <RuleAgeSelectorReadOnly
          to={to}
          from={from}
          minAge={minAge}
          maxAge={maxAge}
        />
      </Stack>
      {children}
    </>
  );
};

export default RuleAgeSelector;
