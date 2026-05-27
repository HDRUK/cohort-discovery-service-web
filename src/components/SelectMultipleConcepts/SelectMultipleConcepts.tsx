import { Concept } from "@/types/api";
import ConceptChip from "../ConceptChip";
import { Button, FormControlLabel, Stack } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import SquareCheckbox from "../SquareCheckbox";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import {
  createRule,
  createRuleGroup,
  isRuleLeaf,
  ruleToGroup,
  updateById,
} from "@/utils/rules";

export const SelectMultipleConcepts = ({
  id,
  concept,
}: {
  id: string;
  concept: Concept;
}) => {
  const {
    queryBuilderJson,
    setQueryBuilderJson,
    showDescendants,
    setSelected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    showDescendants: qb.showDescendants[id],
    setSelected: qb.setSelected,
  }));

  const conceptOptions = useMemo(
    () => [concept, ...(concept.alternatives ?? [])],
    [concept],
  );

  const [selectedConceptIds, setSelectedConceptIds] = useState<number[]>([
    concept.concept_id,
  ]);

  const setConcept = useCallback(
    (c: Concept) => {
      setQueryBuilderJson(
        updateById(queryBuilderJson, id, (node) => {
          if (isRuleLeaf(node)) {
            return {
              ...node,
              rule: {
                ...node.rule,
                concept: c,
              },
            };
          }
          return node;
        }),
      );
    },
    [id, setQueryBuilderJson, queryBuilderJson],
  );

  const removeAlternative = useCallback((parent: Concept, child: Concept) => {
    return {
      ...parent,
      alternatives: parent.alternatives?.filter(
        (c) => c.concept_id !== child.concept_id,
      ),
    };
  }, []);

  const removeMain = useCallback((parent: Concept) => {
    if (!parent?.alternatives?.length) return parent;
    const [concept, ...alternatives] = parent.alternatives;
    return {
      ...concept,
      alternatives,
    };
  }, []);

  const toggleConcept = (conceptId: number) => {
    setSelectedConceptIds((current) =>
      current.includes(conceptId)
        ? current.filter((id) => id !== conceptId)
        : [...current, conceptId],
    );
  };

  const deleteConceptOption = (conceptOption: Concept) => {
    if (conceptOption.concept_id === concept.concept_id) {
      setConcept(removeMain(conceptOption));
    } else {
      setConcept(removeAlternative(concept, conceptOption));
    }

    setSelectedConceptIds((current) =>
      current.filter((id) => id !== conceptOption.concept_id),
    );
  };

  const handleConfirm = useCallback(() => {
    if (selectedConceptIds.length > 1) {
      setQueryBuilderJson(
        updateById(queryBuilderJson, id, (node) => {
          if (!isRuleLeaf(node)) return node;

          const rules = conceptOptions
            .filter((c) => selectedConceptIds.includes(c.concept_id))
            .map((c) => createRule({ concept: c }));

          console.log(rules);

          return createRuleGroup(rules);
        }),
      );
    }
  }, [
    id,
    queryBuilderJson,
    selectedConceptIds,
    conceptOptions,
    setQueryBuilderJson,
  ]);

  return (
    <Stack component="form" spacing={1}>
      {conceptOptions.map((conceptOption) => {
        const checked = selectedConceptIds.includes(conceptOption.concept_id);

        return (
          <Stack
            direction="row"
            alignItems="center"
            key={conceptOption.concept_id}
            spacing={1}
          >
            <FormControlLabel
              control={
                <SquareCheckbox
                  checked={checked}
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
              onDelete={(e) => {
                e.stopPropagation();
                deleteConceptOption(conceptOption);
              }}
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                toggleConcept(conceptOption.concept_id);
              }}
            />
          </Stack>
        );
      })}
      <Stack direction={"row"}>
        <Button
          component="span"
          variant="contained"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleConfirm();
          }}
          sx={() => ({
            borderRadius: 20,
            borderWidth: 2,
            whiteSpace: "nowrap",
            fontWeight: 400,
            fontSize: 15,
            bgcolor: "white",
            color: "text.primary",
            boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.23)",
            pointerEvents: selectedConceptIds.length < 1 ? "none" : "auto",
            opacity: selectedConceptIds.length < 1 ? 0.5 : 1,
          })}
        >
          Confirm Selection
        </Button>
      </Stack>
    </Stack>
  );
};
