"use client";

import { Paper, Slider, Stack } from "@mui/material";
import { ReactNode, useState } from "react";
import useQueryBuilder from "@/store/useQueryBuilder";
import { updateById } from "@/utils/rules";
import { RuleNodeType } from "@/types/rules";
import { CustomH1 } from "@/components/GuidanceHeaders";

export interface RuleAgeSelectorProps {
  children?: ReactNode;
  rule: RuleNodeType;
  title?: string;
  readOnly?: boolean;
  uniDirectional?: boolean;
}

const RuleAgeSelector = ({
  rule,
  title,
  children,
  uniDirectional = false,
  readOnly = false,
}: RuleAgeSelectorProps) => {
  const minAge = 0;
  const maxAge = 120;
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    selected: qb.selected,
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const from = rule.ageConstraint?.[0] ?? minAge;
  const to = rule.ageConstraint?.[1] ?? maxAge;

  const [age, setAge] = useState<number[]>([from, to]);

  const handleCommitChange = () => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        return {
          ...node,
          ageConstraint: [
            age[0] >= minAge ? age[0] : null,
            age[1] < maxAge ? age[1] : null,
          ],
        };
      })
    );
  };

  if (!rule.ageConstraint) return null;

  if (readOnly) {
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
          borderColor: rule.valid ? undefined : "error.main",
        }}
      >
        {label}
      </Paper>
    );
  }

  return (
    <>
      {title && <CustomH1>{title}</CustomH1>}
      <Stack direction="row" spacing={2} alignItems="center" padding={2}>
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
      </Stack>
      {children}
    </>
  );
};

export default RuleAgeSelector;
