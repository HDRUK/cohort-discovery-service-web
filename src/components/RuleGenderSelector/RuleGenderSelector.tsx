"use client";

import { CircularProgress, FormControlLabel, Stack } from "@mui/material";
import SquareCheckbox from "@/components/SquareCheckbox";
import { AgeFilterType } from "@/types/rules";
import { Concept } from "@/types/api";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { updateById } from "@/utils/rules";
import RuleGenderSelectorReadOnly from "./RuleGenderSelectorReadOnly";

interface RuleGenderSelectorProps {
  rule: AgeFilterType;
  readOnly?: boolean;
  title?: string;
}

const RuleGenderSelector = ({ rule, readOnly }: RuleGenderSelectorProps) => {
  const { queryBuilderJson, setQueryBuilderJson, genderConcepts } =
    useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      genderConcepts: qb.genderConcepts,
    }));

  if (readOnly) {
    return <RuleGenderSelectorReadOnly concepts={rule.sex ?? []} />;
  }

  const toggle = (concept: Concept) => {
    const current = rule.sex ?? [];
    const already = current.some((c) => c.concept_id === concept.concept_id);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => ({
        ...node,
        sex: already
          ? current.filter((c) => c.concept_id !== concept.concept_id)
          : [...current, concept],
      })),
    );
  };

  if (genderConcepts.length === 0) {
    return <CircularProgress size={20} />;
  }

  return (
    <Stack>
      {genderConcepts.map((concept) => (
        <FormControlLabel
          key={concept.concept_id}
          control={
            <SquareCheckbox
              checked={
                rule.sex?.some((c) => c.concept_id === concept.concept_id) ??
                false
              }
              onChange={() => toggle(concept)}
            />
          }
          label={concept.name}
        />
      ))}
    </Stack>
  );
};

export default RuleGenderSelector;
