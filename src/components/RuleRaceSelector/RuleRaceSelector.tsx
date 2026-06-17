"use client";

import { CircularProgress, FormControlLabel, Stack } from "@mui/material";
import SquareCheckbox from "@/components/SquareCheckbox";
import { AgeFilterType } from "@/types/rules";
import { Concept } from "@/types/api";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { updateById } from "@/utils/rules";
import RuleRaceSelectorReadOnly from "./RuleRaceSelectorReadOnly";

interface RuleRaceSelectorProps {
  rule: AgeFilterType;
  readOnly?: boolean;
}

const RuleRaceSelector = ({ rule, readOnly }: RuleRaceSelectorProps) => {
  const { queryBuilderJson, setQueryBuilderJson, raceConcepts } =
    useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      raceConcepts: qb.raceConcepts,
    }));

  if (readOnly) {
    return <RuleRaceSelectorReadOnly concepts={rule.race ?? []} />;
  }

  const toggle = (concept: Concept) => {
    const current = rule.race ?? [];
    const already = current.some((c) => c.concept_id === concept.concept_id);
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => ({
        ...node,
        race: already
          ? current.filter((c) => c.concept_id !== concept.concept_id)
          : [...current, concept],
      })),
    );
  };

  if (raceConcepts.length === 0) {
    return <CircularProgress size={20} />;
  }

  return (
    <Stack>
      {raceConcepts.map((concept) => (
        <FormControlLabel
          key={concept.concept_id}
          control={
            <SquareCheckbox
              checked={
                rule.race?.some((c) => c.concept_id === concept.concept_id) ??
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

export default RuleRaceSelector;
