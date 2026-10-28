import { Box } from "@mui/material";
import { AgeFilterType } from "@/types/rules";
import { MAX_AGE_FILTER, MIN_AGE_FILTER } from "@/config/rules";

import RuleWrapper from "../RuleWrapper";
import { RuleAgeSelectorReadOnly } from "@/components/RuleAgeSelector";
import DomainChip from "@/components/DomainChip/DomainChip";

export interface RuleProps {
  rule: AgeFilterType;
  groupId?: string;
}

const RuleAgeFilter = ({ rule, groupId }: RuleProps) => {
  const from = rule.value?.[0] ?? MIN_AGE_FILTER;
  const to = rule.value?.[1] ?? MAX_AGE_FILTER;

  return (
    <RuleWrapper
      node={rule}
      groupId={groupId}
      subTitle={<DomainChip label="Age" />}
    >
      <Box sx={{ width: "fit-content", my: 2 }}>
        <RuleAgeSelectorReadOnly
          from={from}
          to={to}
          minAge={MIN_AGE_FILTER}
          maxAge={MAX_AGE_FILTER}
        />
      </Box>
    </RuleWrapper>
  );
};

export default RuleAgeFilter;
