import { Box } from "@mui/material";
import { DemographicFilterType } from "@/types/rules";
import { DragType } from "@/types/dnd";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import { RuleAgeSelectorReadOnly } from "@/components/RuleAgeSelector";
import DomainChip from "@/components/DomainChip/DomainChip";

export interface RuleProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "render"
> {
  rule: DemographicFilterType;
  groupId?: string;
}

const RuleAgeFilter = ({ rule, groupId, ...rest }: RuleProps) => {
  const { actions } = useNodeActions(rule);

  const from = rule.value?.[0] ?? MIN_AGE_FILTER;
  const to = rule.value?.[1] ?? MAX_AGE_FILTER;

  return (
    <RuleWrapper
      node={rule}
      type={DragType.Rule}
      groupId={groupId}
      sortable={true}
      headerExtra={<DomainChip label="Age" />}
      render={() => (
        <Box sx={{ width: "fit-content", my: 2 }}>
          <RuleAgeSelectorReadOnly
            from={from}
            to={to}
            minAge={MIN_AGE_FILTER}
            maxAge={MAX_AGE_FILTER}
          />
        </Box>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleAgeFilter;
