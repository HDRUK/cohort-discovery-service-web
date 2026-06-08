"use client";

import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { DemographicFilterType } from "@/types/rules";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { isDemographicFilter, updateById } from "@/utils/rules";

type DeceasedValue = "any" | "alive" | "deceased";

const toDeceasedValue = (deceased: boolean | undefined): DeceasedValue => {
  if (deceased === true) return "deceased";
  if (deceased === false) return "alive";
  return "any";
};

const fromDeceasedValue = (value: DeceasedValue): boolean | undefined => {
  if (value === "deceased") return true;
  if (value === "alive") return false;
  return undefined;
};

interface DeceasedSelectorProps {
  rule: DemographicFilterType;
}

const DeceasedSelector = ({ rule }: DeceasedSelectorProps) => {
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const handleChange = (_: React.MouseEvent<HTMLElement>, next: DeceasedValue | null) => {
    if (next === null) return;
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (node) => {
        if (!isDemographicFilter(node)) return node;
        return { ...node, deceased: fromDeceasedValue(next) };
      }),
    );
  };

  return (
    <ToggleButtonGroup
      exclusive
      value={toDeceasedValue(rule.deceased)}
      onChange={handleChange}
      size="small"
      sx={{ my: 1 }}
    >
      <ToggleButton value="any">Any</ToggleButton>
      <ToggleButton value="alive">Alive</ToggleButton>
      <ToggleButton value="deceased">Deceased</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default DeceasedSelector;
