import { Stack } from "@mui/material";
import { RuleLeafType } from "@/types/rules";
import useFeatures from "@/hooks/useFeatures";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import RuleTimeframeSelector from "@/components/RuleTimeframeSelector";
import RuleAgeSelector from "@/components/RuleAgeSelector";
import RuleValueAsNumberSelector from "@/components/RuleValueAsNumberSelector";
import AddTimeframeButton from "@/components/AddTimeFrameButton";
import AddAgeButton from "@/components/AddAgeButton";
import AddValueAsNumberButton from "@/components/AddValueAsNumberButton";
import useRuleParameters from "@/hooks/useRuleParameters";
import { parametersRowSx } from "./RuleParameters.styles";

interface RuleParametersProps {
  rule: RuleLeafType;
}

const RuleParameters = ({ rule }: RuleParametersProps) => {
  const isSelected = useQueryBuilder((qb) => !!qb.selected[rule.id]);
  const { constrainForBunnyV1 } = useFeatures();
  const { hasParameters, hasValue, canAddTimeframe, canAddAge } =
    useRuleParameters(rule);

  if (
    !hasParameters ||
    (!isSelected &&
      !rule.timeConstraint &&
      !rule.ageConstraint &&
      !(hasValue && rule.valueAsNumber))
  ) {
    return null;
  }

  return (
    <Stack direction="row" sx={parametersRowSx}>
      {rule.timeConstraint ? (
        <RuleTimeframeSelector
          data-testid="rule-timeframe-selector"
          rule={rule}
          readOnly={true}
          flex
        />
      ) : isSelected ? (
        <AddTimeframeButton
          label="Add timeframe"
          size="small"
          rule={rule}
          disabled={!canAddTimeframe}
          hoverKey={`rule-timeframe-${rule.id}`}
        />
      ) : null}
      {rule.ageConstraint ? (
        <RuleAgeSelector
          rule={rule}
          readOnly={true}
          uniDirectional={constrainForBunnyV1}
          flex
        />
      ) : isSelected ? (
        <AddAgeButton
          label="Add age"
          size="small"
          rule={rule}
          disabled={!canAddAge}
          hoverKey={`rule-age-${rule.id}`}
        />
      ) : null}
      {hasValue &&
        (rule.valueAsNumber ? (
          <RuleValueAsNumberSelector rule={rule} readOnly={true} flex />
        ) : isSelected ? (
          <AddValueAsNumberButton
            label="Add value"
            size="small"
            rule={rule}
            hoverKey={`rule-value-as-number-${rule.id}`}
          />
        ) : null)}
    </Stack>
  );
};

export default RuleParameters;
