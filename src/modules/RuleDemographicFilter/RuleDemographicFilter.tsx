"use client";

import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { Concept } from "@/types/api";
import { DemographicFilterType } from "@/types/rules";
import { DragType } from "@/types/dnd";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";
import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { updateById } from "@/utils/rules";
import { RuleAgeSelectorReadOnly } from "@/components/RuleAgeSelector";
import ConceptChip from "@/components/ConceptChip";

const DemographicConceptRow = ({
  label,
  concepts,
  onRemove,
  onClearAll,
}: {
  label: string;
  concepts: Concept[];
  onRemove: (conceptId: number) => void;
  onClearAll: () => void;
}) => (
  <Box>
    <Stack direction="row" alignItems="flex-start" spacing={1}>
      <Typography
        variant="body2"
        sx={{ pt: 0.75, color: "text.secondary", flexShrink: 0 }}
      >
        {label} /
      </Typography>
      <Box sx={{ flex: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
        {concepts.length === 0 ? (
          <Paper sx={{ border: 1, p: 1 }}>{`Any ${label.toLowerCase()}`}</Paper>
        ) : (
          concepts.map((c) => (
            <ConceptChip
              key={c.concept_id}
              concept={c}
              showCategory={false}
              onDelete={(e) => {
                e.stopPropagation();
                onRemove(c.concept_id);
              }}
            />
          ))
        )}
      </Box>
      <Button
        variant="text"
        size="small"
        sx={{ flexShrink: 0, color: "text.secondary" }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClearAll();
        }}
      >
        Clear all
      </Button>
    </Stack>
  </Box>
);

export interface RuleDemographicFilterProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "render"
> {
  rule: DemographicFilterType;
  groupId?: string;
}

const RuleDemographicFilter = ({
  rule,
  groupId,
  ...rest
}: RuleDemographicFilterProps) => {
  const { actions } = useNodeActions(rule);
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const from = rule.age?.[0] ?? MIN_AGE_FILTER;
  const to = rule.age?.[1] ?? MAX_AGE_FILTER;

  const update = (patch: Partial<DemographicFilterType>) =>
    setQueryBuilderJson(
      updateById(queryBuilderJson, rule.id, (n) => ({ ...n, ...patch })),
    );

  const removeConcept = (field: "sex" | "race") => (conceptId: number) => {
    const list: Concept[] = rule[field] ?? [];
    update({ [field]: list.filter((c) => c.concept_id !== conceptId) });
  };

  return (
    <RuleWrapper
      node={rule}
      type={DragType.Rule}
      groupId={groupId}
      sortable
      headerExtra={
        <Chip
          sx={{ bgcolor: "white" }}
          variant="outlined"
          label="Demographic"
        />
      }
      render={() => (
        <Stack spacing={2} sx={{ py: 1 }}>
          <Stack direction="row" justifyContent="space-between" spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", flexShrink: 0 }}
              >
                Age /
              </Typography>

              <RuleAgeSelectorReadOnly
                from={from}
                to={to}
                minAge={MIN_AGE_FILTER}
                maxAge={MAX_AGE_FILTER}
              />
            </Stack>
            <Button
              variant="text"
              size="small"
              sx={{ flexShrink: 0, color: "text.secondary" }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                update({ age: [MIN_AGE_FILTER, MAX_AGE_FILTER] });
              }}
            >
              Clear all
            </Button>
          </Stack>

          <Divider />

          <DemographicConceptRow
            label="Sex"
            concepts={rule.sex ?? []}
            onRemove={removeConcept("sex")}
            onClearAll={() => update({ sex: [] })}
          />

          <Divider />

          <DemographicConceptRow
            label="Race"
            concepts={rule.race ?? []}
            onRemove={removeConcept("race")}
            onClearAll={() => update({ race: [] })}
          />
        </Stack>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleDemographicFilter;
