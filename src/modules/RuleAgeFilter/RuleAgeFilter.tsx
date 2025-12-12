import { Chip, Box } from "@mui/material";
import { AgeFilterType } from "@/types/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import RuleAgeSelector from "@/components/RuleAgeSelector";

export interface RuleProps
  extends Omit<RuleWrapperProps, "node" | "type" | "render"> {
  rule: AgeFilterType;
  groupId?: string;
}

const RuleAgeFilter = ({ rule, groupId, ...rest }: RuleProps) => {
  const actions = useNodeActions(rule);

  return (
    <RuleWrapper
      node={rule}
      type="Rule"
      groupId={groupId}
      sortable={true}
      renderInHeader
      headerExtra={<Chip variant="outlined" label={"Age"} />}
      render={() => (
        <Box sx={{ mx: "auto" }}>
          <RuleAgeSelector rule={rule} readOnly />
        </Box>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleAgeFilter;
