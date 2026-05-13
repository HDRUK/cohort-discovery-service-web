import { RuleGroupType } from "@/types/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import { Stack } from "@mui/material";
import ConceptChip from "@/components/ConceptChip";
import { isRuleLeaf } from "@/utils/rules";

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
            if (isRuleLeaf(r)) {
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
      headerExtra={<> hi</>}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleGroupSlim;
