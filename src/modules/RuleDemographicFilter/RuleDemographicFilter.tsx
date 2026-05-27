"use client";

import { Box, Chip, Paper } from "@mui/material";
import { DemographicFilterType } from "@/types/rules";
import RuleWrapper from "../RuleWrapper";
import { RuleWrapperProps } from "../RuleWrapper/RuleWrapper";
import useNodeActions from "@/hooks/useNodeActions";
import RuleAgeSelector from "@/components/RuleAgeSelector";

export interface RuleDemographicFilterProps extends Omit<
  RuleWrapperProps,
  "node" | "type" | "render"
> {
  rule: DemographicFilterType;
  groupId?: string;
}

const deceasedLabel = (deceased: boolean | undefined) => {
  if (deceased === true) return "Deceased";
  if (deceased === false) return "Alive";
  return "Any";
};

const RuleDemographicFilter = ({ rule, groupId, ...rest }: RuleDemographicFilterProps) => {
  const { actions } = useNodeActions(rule);

  return (
    <RuleWrapper
      node={rule}
      type="Rule"
      groupId={groupId}
      sortable={true}
      headerExtra={<Chip variant="outlined" label="Demographic" />}
      render={() => (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "fit-content" }}>
          <RuleAgeSelector rule={rule} readOnly overrideConstrainForBunny />
          <Paper sx={{ border: 1, p: 1 }}>
            Deceased: {deceasedLabel(rule.deceased)}
          </Paper>
          {!!rule.location?.length && (
            <Paper sx={{ border: 1, p: 1 }}>
              Location: {rule.location.join(", ")}
            </Paper>
          )}
        </Box>
      )}
      actions={actions}
      {...rest}
    />
  );
};

export default RuleDemographicFilter;
