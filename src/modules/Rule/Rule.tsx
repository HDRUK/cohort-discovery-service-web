import { Box } from "@mui/material";
import { DragType } from "@/types/dnd";
import DomainChip from "@/components/DomainChip/DomainChip";
import { Concept } from "@/types/api";
import { useCallback, useMemo, useState } from "react";
import ConceptChip from "@/components/ConceptChip";
import { RuleLeafType, SingleSidedOperator } from "@/types/rules";
import RuleSearch from "./RuleSearch";

import useQueryBuilder from "@/hooks/useQueryBuilder";
import {
  isEmptyRule,
  updateById,
  isSingleConcept,
  isRuleLeaf,
} from "@/utils/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import RuleFooter from "../RuleFooter";
import { useForm, useWatch } from "react-hook-form";

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
    isSelected,
    select,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    showDescendants: qb.showDescendants[id],
    setShowDescendants: qb.setShowDescendants,
    isSelected: !!qb.selected[id],
    select: qb.select,
  }));

  const toggleShowDescendants = useCallback(
    () => setShowDescendants(id, !showDescendants),
    [id, showDescendants, setShowDescendants],
  );

  const [hasOptions, setHasOptions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});

  type FormValues = { concepts: Record<number, Concept> };

  const { control, setValue, reset } = useForm<FormValues>({
    defaultValues: { concepts: {} },
  });

  const conceptsMap = useWatch({ control, name: "concepts", defaultValue: {} });

  const selectedConcepts = useMemo(
    () => Object.values(conceptsMap),
    [conceptsMap],
  );

  const clearAll = useCallback(() => {
    setSelectedIds({});
    reset({ concepts: {} });
  }, [reset]);

  const setConcept = useCallback(
    (c: Concept | Concept[]) => {
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

  const handleConfirm = useCallback(() => {
    const clean = selectedConcepts.map(
      ({ alternatives: _omit, ...c }) => c as Concept,
    );
    if (clean.length === 1) {
      setConcept(clean[0]);
    } else if (clean.length > 1) {
      setConcept(clean);
    }
    reset({ concepts: {} });
    setSelectedIds({});
  }, [selectedConcepts, reset, setConcept]);

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
            valueAsNumber: undefined,
            valueAsNumberOperator: undefined,
          };
        }
        return node;
      }),
    );
  }, [id, queryBuilderJson, setQueryBuilderJson]);

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

  const { actions } = useNodeActions(rule);

  return (
    <RuleWrapper
      node={rule}
      type={DragType.Rule}
      groupId={groupId}
      sortable={true}
      headerExtra={!isEmptyRule(rule) ? <DomainChip concept={concept} /> : null}
      renderFooter={
        <RuleFooter
          handleConfirm={handleConfirm}
          clearAll={clearAll}
          rule={rule}
          selectedConceptsLength={selectedConcepts.length}
          isSelected={isSelected}
          hasOptions={hasOptions}
        />
      }
      render={() => (
        <Box py={1}>
          {isEmptyRule(rule) ? (
            <RuleSearch
              onConfirm={setConcept}
              onSelect={() => select(id)}
              conceptsMap={conceptsMap}
              control={control}
              setValue={setValue}
              reset={reset}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              setHasOptions={setHasOptions}
            />
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
                        key={childConcept.concept_id}
                        concept={childConcept}
                        onDelete={() => {
                          setConcept(removeChild(concept, childConcept));
                        }}
                      />
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
