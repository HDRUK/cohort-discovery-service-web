import { RuleGroupType } from "@/types/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import { Chip, Stack } from "@mui/material";
import ConceptChip from "@/components/ConceptChip";
import { isEmptyRule, isOperator, isRuleLeaf } from "@/utils/rules";

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
              return (
                <ConceptChip
                  draggable
                  key={r.id}
                  concept={r.rule.concept}
                  onDelete={() => alert("ah")}
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
