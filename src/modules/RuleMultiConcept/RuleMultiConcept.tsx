"use client";

import { Concept } from "@/types/api";
import { RuleLeafType } from "@/types/rules";
import ConceptChip from "@/components/ConceptChip";
import { Stack } from "@mui/material";
import DomainChip from "@/components/DomainChip/DomainChip";
import { useCallback, useMemo } from "react";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import useNodeActions from "@/hooks/useNodeActions";
import { isMultipleConcept, isRuleLeaf, updateById } from "@/utils/rules";
import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import { getDomain } from "@/utils/omop";

interface RuleMultiConceptProps
  extends Omit<RuleWrapperProps, "node" | "type" | "render"> {
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

  const concepts = useMemo(
    () => (isMultipleConcept(concept) ? concept : []),
    [concept],
  );

  const headerLabel = useMemo(() => {
    const unique = new Set(concepts.map((c) => getDomain(c)).filter(Boolean));
    return unique.size === 1 ? [...unique][0] : "Mixed";
  }, [concepts]);

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

  const handleDelete = useCallback(
    (toDelete: Concept) => {
      const remaining = concepts.filter(
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
    [concepts, setConcept],
  );

  return (
    <RuleWrapper
      node={rule}
      type="Rule"
      groupId={groupId}
      sortable={true}
      headerExtra={<DomainChip label={headerLabel} />}
      render={() => (
        <Stack spacing={1} py={1}>
          {concepts.map((c) => (
            <ConceptChip
              key={c.concept_id}
              indicateIfParent={showDescendants}
              concept={c}
              onDelete={(e) => {
                e.stopPropagation();
                handleDelete(c);
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
