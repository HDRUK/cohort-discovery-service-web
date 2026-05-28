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
import { hasAlternatives, isRuleLeaf, updateById } from "@/utils/rules";
import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import { getDomain } from "@/utils/omop";

interface RuleAlternativesProps
  extends Omit<RuleWrapperProps, "node" | "type" | "render"> {
  rule: RuleLeafType;
  groupId?: string;
}

const RuleAlternatives = ({
  rule,
  groupId,
  ...rest
}: RuleAlternativesProps) => {
  const {
    id,
    rule: { concept },
  } = rule;

  const { actions } = useNodeActions(rule);

  const { queryBuilderJson, setQueryBuilderJson, showDescendants, isSelected } =
    useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      showDescendants: qb.showDescendants[id],
      isSelected: !!qb.selected[id],
    }));

  const conceptOptions = useMemo(
    () =>
      hasAlternatives(concept) ? [concept, ...concept.alternatives] : [],
    [concept],
  );

  const [selectedConceptIds, setSelectedConceptIds] = useState<number[]>(() =>
    conceptOptions.length > 0 ? [conceptOptions[0].concept_id] : [],
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

  const handleDelete = useCallback(
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

  const footer = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={1}
      py={0.75}
      gap={1}
    >
      <Stack direction="row" alignItems="center" gap={1} flexShrink={1} minWidth={0}>
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
  );

  return (
    <RuleWrapper
      node={rule}
      type="Rule"
      groupId={groupId}
      sortable={true}
      headerExtra={<Chip variant="outlined" label={headerLabel} />}
      renderFooter={footer}
      render={() => (
        <Stack component="form" spacing={1} py={1}>
          {conceptOptions.map((conceptOption, i) => (
            <Stack
              direction="row"
              alignItems="center"
              key={conceptOption.concept_id}
              spacing={1}
            >
              {isSelected && (
                <FormControlLabel
                  control={
                    <SquareCheckbox
                      checked={selectedConceptIds.includes(conceptOption.concept_id)}
                      onChange={() => toggleConcept(conceptOption.concept_id)}
                      onClick={(e) => e.stopPropagation()}
                      sx={{ p: 0 }}
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              )}
              <ConceptChip
                indicateIfParent={showDescendants}
                concept={conceptOption}
                categoryLabel={allDomains[i] || undefined}
                onDelete={(e) => {
                  e.stopPropagation();
                  handleDelete(conceptOption);
                }}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  toggleConcept(conceptOption.concept_id);
                }}
              />
            </Stack>
          ))}
        </Stack>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleAlternatives;
