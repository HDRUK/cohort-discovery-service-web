import { Chip, Box } from "@mui/material";
import SearchConcepts from "@/components/SearchConcepts";
import { Concept } from "@/types/api";
import { useCallback, useEffect, useRef } from "react";
import ConceptChip from "@/components/ConceptChip";
import { RuleLeafType, SingleSidedOperator } from "@/types/rules";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import {
  isEmptyRule,
  updateById,
  isSingleConcept,
  isRuleLeaf,
  isMultipleConcept,
} from "@/utils/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import InvalidRule from "@/components/InvalidRule";
import { getDomain } from "@/utils/omop";
import { useCohortBuilderContext } from "@/providers/CohortBuilderProvider";

export interface RuleProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "render"
> {
  rule: RuleLeafType;
  groupId?: string;
}

const Rule = ({ rule, groupId, ...rest }: RuleProps) => {
  const {
    id,
    rule: { concept },
  } = rule;

  const {
    queryBuilderJson,
    setQueryBuilderJson,
    showDescendants,
    setShowDescendants,
    setSelected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    showDescendants: qb.showDescendants[id],
    setShowDescendants: qb.setShowDescendants,
    setSelected: qb.setSelected,
  }));

  const toggleShowDescendants = useCallback(
    () => setShowDescendants(id, !showDescendants),
    [id, showDescendants, setShowDescendants],
  );

  const setConcept = useCallback(
    (c: Concept) => {
      setQueryBuilderJson(
        updateById(queryBuilderJson, id, (node) => {
          if (isRuleLeaf(node)) {
            return {
              ...node,
              rule: { ...node.rule, concept: c },
            };
          }
          return node;
        }),
      );
    },
    [id, setQueryBuilderJson, queryBuilderJson],
  );

  const clearConcept = useCallback(() => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (isRuleLeaf(node)) {
          return {
            ...node,
            rule: { ...node.rule, concept: null },
            ageConstraint: undefined,
            ageConstraintOperator: SingleSidedOperator.GREATER_THAN,
            timeConstraint: undefined,
            timeConstraintOperator: SingleSidedOperator.GREATER_THAN,
          };
        }
        return node;
      }),
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const onClick = useCallback(
    (c: Concept) => {
      setConcept(c);
    },
    [setConcept],
  );

  const removeChild = useCallback((parent: Concept, child: Concept) => {
    const children = parent.children?.filter(
      (c) => c.concept_id !== child.concept_id,
    );
    const newConcept = {
      ...parent,
      children,
    };
    return newConcept;
  }, []);

  const removeAlternative = useCallback((parent: Concept, child: Concept) => {
    const alternatives = parent.alternatives?.filter(
      (c) => c.concept_id !== child.concept_id,
    );
    const newConcept = {
      ...parent,
      alternatives,
    };
    return newConcept;
  }, []);

  const { actions } = useNodeActions(rule);

  // DP-722: auto-focus the "Term search..." input when this rule block is newly created.
  // We piggyback on the existing "pendingScrollToNodeId" signal.
  // Only this Rule component reacts to it, because groups and operators do not render this search input.
  const { pendingScrollToNodeId } = useCohortBuilderContext();
  const searchBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pendingScrollToNodeId !== id) return;

    const input =
      searchBoxRef.current?.querySelector<HTMLInputElement>("input");
    // preventScroll lets the existing smooth-scroll-to-new-node animation run uninterrupted.
    input?.focus({ preventScroll: true });
  }, [pendingScrollToNodeId, id]);

  return (
    <RuleWrapper
      node={rule}
      type="Rule"
      groupId={groupId}
      sortable={true}
      headerExtra={
        !isEmptyRule(rule) ? (
          <Chip variant="outlined" label={getDomain(concept)} />
        ) : null
      }
      render={() => (
        <Box py={1} ref={searchBoxRef}>
          {isEmptyRule(rule) ? (
            <SearchConcepts onClick={onClick} />
          ) : (
            <>
              {isSingleConcept(concept) && (
                <>
                  <ConceptChip
                    indicateIfParent={showDescendants}
                    concept={concept}
                    onDelete={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      clearConcept();
                    }}
                    onClick={
                      (concept?.children?.length ?? 0) > 0
                        ? (e: React.MouseEvent) => {
                            e.stopPropagation();
                            toggleShowDescendants();
                          }
                        : (e: React.MouseEvent) => {
                            e.stopPropagation();
                          }
                    }
                  />
                  {showDescendants &&
                    concept?.children?.map((childConcept) => (
                      <ConceptChip
                        draggable={false}
                        key={childConcept.concept_id}
                        concept={childConcept}
                        onDelete={() => {
                          setConcept(removeChild(concept, childConcept));
                        }}
                      />
                    ))}
                </>
              )}
              {isMultipleConcept(concept) && (
                <>
                  <ConceptChip
                    indicateIfParent={showDescendants}
                    concept={concept}
                    onDelete={() => {
                      clearConcept();
                    }}
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setConcept({ ...concept, alternatives: [] });
                      setSelected(id, true, true);
                    }}
                  />

                  {concept?.alternatives &&
                    concept?.alternatives?.map((childConcept) => (
                      <ConceptChip
                        chipSx={{
                          borderColor: "error.main",
                        }}
                        draggable={false}
                        key={childConcept.concept_id}
                        concept={childConcept}
                        onClick={() => setConcept(childConcept)}
                        onDelete={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setConcept(removeAlternative(concept, childConcept));
                          setSelected(id, true, true);
                        }}
                      >
                        {" "}
                        <InvalidRule reasons={[]} />
                      </ConceptChip>
                    ))}
                </>
              )}
            </>
          )}
        </Box>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default Rule;
