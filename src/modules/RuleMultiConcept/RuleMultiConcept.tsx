"use client";

import { Concept } from "@/types/api";
import { RuleLeafType } from "@/types/rules";
import { ConceptChip } from "@/components/ConceptChip/ConceptChip";
import { Stack } from "@mui/material";
import DomainChip from "@/components/DomainChip/DomainChip";
import { useCallback, useMemo } from "react";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import useNodeActions from "@/hooks/useNodeActions";
import { isMultipleConcept, isRuleLeaf, updateById } from "@/utils/rules";
import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import { useDraggable } from "@dnd-kit/core";

const DraggableConceptChip = ({
  concept,
  sourceRuleId,
  sourceGroupId,
  onDelete,
  indicateIfParent,
}: {
  concept: Concept;
  sourceRuleId: string;
  sourceGroupId: string | undefined;
  onDelete: (e: React.MouseEvent) => void;
  indicateIfParent?: boolean;
}) => {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: `concept-drag-${concept.concept_id}-${sourceRuleId}`,
    data: { type: "Concept", concept, sourceRuleId, sourceGroupId },
  });

  return (
    <ConceptChip
      concept={concept}
      onDelete={onDelete}
      indicateIfParent={indicateIfParent}
      draggable
      chipSx={{ opacity: isDragging ? 0.4 : 1 }}
      dragProps={{
        nodeRef: setNodeRef,
        handleListeners: listeners,
        handleAttributes: attributes,
      }}
    />
  );
};

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
      headerExtra={<DomainChip concept={concept} />}
      render={() => (
        <Stack spacing={1} py={1}>
          {concepts.map((c) => (
            <DraggableConceptChip
              key={c.concept_id}
              concept={c}
              sourceRuleId={id}
              sourceGroupId={groupId}
              indicateIfParent={showDescendants}
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
