import { RuleGroupType } from "@/types/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import { Chip, Stack } from "@mui/material";
import ConceptChip from "@/components/ConceptChip";
import { isEmptyRule, isOperator, isRuleLeaf, removeById } from "@/utils/rules";
import useQueryBuilder from "@/hooks/useQueryBuilder";

export interface RuleGroupProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "render"
> {
  group: RuleGroupType;
  parentGroupId?: string;
  showConnector?: boolean;
}

const RuleGroupSlim = ({ group, parentGroupId, ...rest }: RuleGroupProps) => {
  const { actions } = useNodeActions(group);
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));
  const groupOperators = group.rules
    .filter((r) => isOperator(r))
    .map((op) => op.combinator);

  const allOperatorsSame = groupOperators.every(
    (op) => op === groupOperators[0],
  );

  const groupOperator = allOperatorsSame ? groupOperators[0] : "Mixed";

  return (
    <RuleWrapper
      node={group}
      type="Group"
      groupId={parentGroupId}
      sortable={true}
      render={() => (
        <Stack>
          {" "}
          {group.rules.map((r) => {
            if (isRuleLeaf(r) && !isEmptyRule(r)) {
              const c = r.rule.concept;
              const singleConcept = Array.isArray(c) ? c[0] : c;
              if (!singleConcept) return null;
              return (
                <ConceptChip
                  draggable
                  key={r.id}
                  concept={singleConcept}
                  onDelete={() =>
                    setQueryBuilderJson(removeById(queryBuilderJson, r.id))
                  }
                />
              );
            }
          })}
        </Stack>
      )}
      headerExtra={
        <Chip variant="outlined" label={groupOperator.toUpperCase()} />
      }
      actions={actions}
      {...rest}
    />
  );
};

export default RuleGroupSlim;
