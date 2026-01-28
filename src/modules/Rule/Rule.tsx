import { Chip, Box } from "@mui/material";
import SearchConcepts from "@/components/SearchConcepts";
import { Concept } from "@/types/api";
import { useCallback } from "react";
import ConceptChip from "@/components/ConceptChip";
import { RuleLeafType } from "@/types/rules";

import useQueryBuilder from "@/store/useQueryBuilder";
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
import { mapDomain } from "@/utils/domains";

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

  const domain =
    concept && Array.isArray(concept)
      ? concept?.[0].category
      : concept?.category;

  const {
    queryBuilderJson,
    setQueryBuilderJson,
    showDescendants,
    setShowDescendants,
    select,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    showDescendants: qb.showDescendants[id],
    setShowDescendants: qb.setShowDescendants,
    select: qb.select,
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

  const actions = useNodeActions(rule);

  return (
    <RuleWrapper
      node={rule}
      type="Rule"
      groupId={groupId}
      sortable={true}
      headerExtra={
        !isEmptyRule(rule) && domain ? (
          <Chip variant="outlined" label={mapDomain(domain)} />
        ) : null
      }
      render={() => (
        <Box py={1}>
          {isEmptyRule(rule) ? (
            <SearchConcepts onClick={onClick} />
          ) : (
            <>
              {isSingleConcept(concept) && (
                <>
                  <ConceptChip
                    indicateIfParent={showDescendants}
                    concept={concept}
                    onDelete={() => clearConcept()}
                    onClick={
                      (concept?.children?.length ?? 0) > 0
                        ? (e: React.MouseEvent) => {
                            e.stopPropagation();
                            toggleShowDescendants();
                          }
                        : undefined
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
                      select(id);
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
                          select(id);
                        }}
                      >
                        {" "}
                        <InvalidRule reasons={[]} />{" "}
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
