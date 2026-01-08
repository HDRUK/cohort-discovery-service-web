import { RuleGroupType } from "@/types/rules";

import RuleBoard from "../RuleBoard";
import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";

export interface RuleGroupProps
  extends Omit<RuleWrapperProps, "node" | "type" | "render"> {
  group: RuleGroupType;
  parentGroupId?: string;
  showConnector?: boolean;
}

const RuleGroup = ({ group, parentGroupId, ...rest }: RuleGroupProps) => {
  const actions = useNodeActions(group);

  return (
    <RuleWrapper
      node={group}
      type="Group"
      groupId={parentGroupId}
      sortable={true}
      render={() => <RuleBoard ruleGroup={group} />}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleGroup;
