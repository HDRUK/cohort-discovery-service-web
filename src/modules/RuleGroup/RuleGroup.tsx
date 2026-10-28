import { RuleGroupType } from "@/types/rules";

import RuleBoard from "../RuleBoard";
import RuleWrapper from "../RuleWrapper";

export interface RuleGroupProps {
  group: RuleGroupType;
  parentGroupId?: string;
}

const RuleGroup = ({ group, parentGroupId }: RuleGroupProps) => {
  return (
    <RuleWrapper node={group} groupId={parentGroupId}>
      <RuleBoard ruleGroup={group} />
    </RuleWrapper>
  );
};

export default RuleGroup;
