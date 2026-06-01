import { Box } from "@mui/material";
import { AgeFilterType } from "@/types/rules";
import { DragType } from "@/types/dnd";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import RuleAgeSelector from "@/components/RuleAgeSelector";
import DomainChip from "@/components/DomainChip/DomainChip";

export interface RuleProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "render"
> {
  rule: AgeFilterType;
  groupId?: string;
}

const RuleAgeFilter = ({ rule, groupId, ...rest }: RuleProps) => {
  const { actions } = useNodeActions(rule);

  return (
    <RuleWrapper
      node={rule}
      type={DragType.Rule}
      groupId={groupId}
      sortable={true}
      headerExtra={<DomainChip label="Age" />}
      render={() => (
        <Box sx={{ width: "fit-content" }}>
          <RuleAgeSelector rule={rule} readOnly overrideConstrainForBunny />
        </Box>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleAgeFilter;
