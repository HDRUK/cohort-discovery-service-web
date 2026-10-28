import { RuleGroupType } from "@/types/rules";
import { DragType } from "@/types/dnd";

import RuleBoard from "../RuleBoard";
import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";

export interface RuleGroupProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "children"
> {
  group: RuleGroupType;
  parentGroupId?: string;
  showConnector?: boolean;
}

const RuleGroup = ({ group, parentGroupId, ...rest }: RuleGroupProps) => {
  const { actions } = useNodeActions(group);

  return (
    <RuleWrapper
      node={group}
      type={DragType.Group}
      groupId={parentGroupId}
      sortable={true}
      actions={actions}
      {...rest}
    >
      <RuleBoard ruleGroup={group} />
    </RuleWrapper>
  );
};

export default RuleGroup;
