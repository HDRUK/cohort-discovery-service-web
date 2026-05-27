"use client";

import { Concept } from "@/types/api";
import { RuleLeafType } from "@/types/rules";
import ConceptChip from "@/components/ConceptChip";
import SquareCheckbox from "@/components/SquareCheckbox";
import ErrorIcon from "@/components/ErrorIcon";
import {
  Button,
  Chip,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import useNodeActions from "@/hooks/useNodeActions";
import {
  hasAlternatives,
  isMultipleConcept,
  isRuleLeaf,
  updateById,
} from "@/utils/rules";
import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import { getDomain } from "@/utils/omop";

interface RuleMultiConceptProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "render"
> {
  rule: RuleLeafType;
  groupId?: string;
}

const RuleMultiConcept = ({
  rule,
  groupId,
  ...rest
}: RuleMultiConceptProps) => {
  const {
    id,
    rule: { concept },
  } = rule;

  const { actions } = useNodeActions(rule);

  const { queryBuilderJson, setQueryBuilderJson, showDescendants } =
    useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      showDescendants: qb.showDescendants[id],
    }));

  const conceptOptions = useMemo(() => {
    if (hasAlternatives(concept)) return [concept, ...concept.alternatives];
    if (isMultipleConcept(concept)) return concept;
    return [];
  }, [concept]);

  const [selectedConceptIds, setSelectedConceptIds] = useState<number[]>(() =>
    conceptOptions.map((c) => c.concept_id),
  );

  const allDomains = useMemo(
    () => conceptOptions.map((c) => getDomain(c) ?? ""),
    [conceptOptions],
  );

  const headerLabel = useMemo(() => {
    const unique = new Set(allDomains.filter(Boolean));
    return unique.size === 1 ? [...unique][0] : "Mixed";
  }, [allDomains]);

  const setConcept = useCallback(
    (c: Concept | Concept[]) => {
      setQueryBuilderJson(
        updateById(queryBuilderJson, id, (node) => {
          if (isRuleLeaf(node)) {
            return { ...node, rule: { ...node.rule, concept: c } };
          }
          return node;
        }),
      );
    },
    [id, setQueryBuilderJson, queryBuilderJson],
  );

  const toggleConcept = (conceptId: number) => {
    setSelectedConceptIds((current) =>
      current.includes(conceptId)
        ? current.filter((cid) => cid !== conceptId)
        : [...current, conceptId],
    );
  };

  const clearAll = () => setSelectedConceptIds([]);

  const handleConfirm = useCallback(() => {
    const selected = conceptOptions.filter((c) =>
      selectedConceptIds.includes(c.concept_id),
    );
    if (selected.length === 1) {
      const { alternatives: _omit, ...single } = selected[0] as Concept & {
        alternatives?: Concept[];
      };
      setConcept(single);
    } else if (selected.length > 1) {
      setConcept(
        selected.map(({ alternatives: _omit, ...c }) => c as Concept),
      );
    }
  }, [conceptOptions, selectedConceptIds, setConcept]);

  const deleteFromAlternatives = useCallback(
    (toDelete: Concept) => {
      if (!hasAlternatives(concept)) return;
      if (toDelete.concept_id === concept.concept_id) {
        if (!concept.alternatives.length) return;
        const [newMain, ...rest] = concept.alternatives;
        setConcept(
          rest.length > 0 ? { ...newMain, alternatives: rest } : newMain,
        );
      } else {
        const remaining = concept.alternatives.filter(
          (c) => c.concept_id !== toDelete.concept_id,
        );
        setConcept(
          remaining.length > 0
            ? { ...concept, alternatives: remaining }
            : { ...concept, alternatives: undefined },
        );
      }
      setSelectedConceptIds((current) =>
        current.filter((cid) => cid !== toDelete.concept_id),
      );
    },
    [concept, setConcept],
  );

  const deleteFromConfirmed = useCallback(
    (toDelete: Concept) => {
      if (!isMultipleConcept(concept)) return;
      const remaining = concept.filter(
        (c) => c.concept_id !== toDelete.concept_id,
      );
      if (remaining.length === 1) {
        const { alternatives: _omit, ...single } = remaining[0] as Concept & {
          alternatives?: Concept[];
        };
        setConcept(single);
      } else {
        setConcept(remaining);
      }
    },
    [concept, setConcept],
  );

  const alternativesFooter = hasAlternatives(concept) ? (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      py={0.75}
      gap={1}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        flexShrink={1}
        minWidth={0}
      >
        <ErrorIcon />
        <Typography variant="body2" noWrap>
          A rule has alternatives, please select one or more concepts
        </Typography>
      </Stack>
      <Stack direction="row" gap={1} flexShrink={0}>
        <Button
          color="secondary"
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            clearAll();
          }}
          sx={{ whiteSpace: "nowrap" }}
        >
          Clear all
        </Button>
        <Button
          color="secondary"
          size="small"
          variant="contained"
          disabled={selectedConceptIds.length < 1}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleConfirm();
          }}
          sx={{ whiteSpace: "nowrap" }}
        >
          Confirm selection
        </Button>
      </Stack>
    </Stack>
  ) : undefined;

  return (
    <RuleWrapper
      node={rule}
      type="Rule"
      groupId={groupId}
      sortable={true}
      headerExtra={<Chip variant="outlined" label={headerLabel} />}
      renderFooter={alternativesFooter}
      render={() => (
        <Stack component="form" spacing={1} py={1}>
          {hasAlternatives(concept)
            ? conceptOptions.map((conceptOption, i) => (
                <Stack
                  direction="row"
                  alignItems="center"
                  key={conceptOption.concept_id}
                  spacing={1}
                >
                  <FormControlLabel
                    control={
                      <SquareCheckbox
                        checked={selectedConceptIds.includes(
                          conceptOption.concept_id,
                        )}
                        onChange={() => toggleConcept(conceptOption.concept_id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    }
                    label=""
                    sx={{ m: 0 }}
                  />
                  <ConceptChip
                    indicateIfParent={showDescendants}
                    concept={conceptOption}
                    categoryLabel={allDomains[i] || undefined}
                    onDelete={(e) => {
                      e.stopPropagation();
                      deleteFromAlternatives(conceptOption);
                    }}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      toggleConcept(conceptOption.concept_id);
                    }}
                  />
                </Stack>
              ))
            : isMultipleConcept(concept) &&
              concept.map((c, i) => (
                <ConceptChip
                  key={c.concept_id}
                  indicateIfParent={showDescendants}
                  concept={c}
                  categoryLabel={allDomains[i] || undefined}
                  onDelete={(e) => {
                    e.stopPropagation();
                    deleteFromConfirmed(c);
                  }}
                />
              ))}
        </Stack>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleMultiConcept;
