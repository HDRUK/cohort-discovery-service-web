import { Typography, Chip, Alert } from "@mui/material";
import SearchConcepts from "@/components/SearchConcepts";
import { Concept } from "@/types/api";
import { useCallback, useState } from "react";
import ConceptChip from "@/components/ConceptChip";
import { RuleLeafType } from "@/types/rules";

import useQueryBuilder from "@/store/useQueryBuilder";
import {
  isEmptyRule,
  updateById,
  removeById,
  isSingleConcept,
  isRuleLeaf,
  ruleToGroup,
  isMultipleConcept,
} from "@/utils/rules";

import RuleWrapper from "../RuleWrapper";

export interface RuleProps {
  rule: RuleLeafType;
  groupId?: string;
}

const Rule = ({ rule, groupId, ...rest }: RuleProps) => {
  const {
    id,
    exclude,
    valid = true,
    rule: { concept },
  } = rule;

  const domain =
    concept && Array.isArray(concept)
      ? concept?.[0].category
      : concept?.category;

  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

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
        })
      );
    },
    [id, setQueryBuilderJson, queryBuilderJson]
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
      })
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const [showChildren, setShowChildren] = useState<boolean>(false);
  const onClick = useCallback(
    (c: Concept) => {
      setConcept(c);
    },
    [setConcept]
  );

  const removeChild = useCallback((parent: Concept, child: Concept) => {
    const children = parent.children?.filter(
      (c) => c.concept_id !== child.concept_id
    );
    const newConcept = {
      ...parent,
      children,
    };
    return newConcept;
  }, []);

  const handleDeleteRule = useCallback(() => {
    const newQuery = removeById(queryBuilderJson, id);
    setQueryBuilderJson(newQuery);
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const handleConvertToGroup = useCallback(() => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, id, (node) => {
        if (!isRuleLeaf(node)) return node;
        const newGroup = ruleToGroup(node);
        return newGroup;
      })
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

  const actions = [
    { action: handleConvertToGroup, label: "Convert to Group" },
    { action: handleDeleteRule, label: "Delete" },
  ];

  return (
    <RuleWrapper
      node={rule}
      type="Rule"
      groupId={groupId}
      sortable={true}
      exclude={exclude}
      valid={valid}
      headerExtra={
        <>
          {!isEmptyRule(rule) && domain && (
            <>
              <Typography variant="h5">/</Typography>
              <Chip
                sx={{
                  bgcolor: "white",
                  borderColor: "white",
                }}
                variant="outlined"
                label={domain}
              />
            </>
          )}
        </>
      }
      render={() => (
        <>
          {isEmptyRule(rule) ? (
            <SearchConcepts onClick={onClick} />
          ) : (
            <>
              {isSingleConcept(concept) && (
                <>
                  <ConceptChip
                    indicateIfParent={showChildren}
                    concept={concept}
                    onDelete={() => clearConcept()}
                    onClick={
                      concept?.children && concept.children.length > 0
                        ? () => setShowChildren(!showChildren)
                        : undefined
                    }
                  />
                  {showChildren &&
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
                <Alert color="error"> Not yet implemented </Alert>
              )}
            </>
          )}
        </>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default Rule;
