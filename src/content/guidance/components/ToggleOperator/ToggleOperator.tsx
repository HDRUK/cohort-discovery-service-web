import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import SquareRadio from "@/components/SquareRadio";
import { CombinatorType, OperatorType } from "@/types/rules";
import { updateById } from "@/utils/rules";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { collapsibleGuidanceKey } from "@/utils/queryBuilder";

type ToggleOperatorProps = {
  operator: OperatorType;
};

const ToggleOperator = ({ operator }: ToggleOperatorProps) => {
  const {
    queryBuilderJson,
    setQueryBuilderJson,
    setSelectedGuidance,
    selected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    setSelectedGuidance: qb.setSelectedGuidance,
    selected: qb.selected,
  }));

  const handleToggleOperator = (newNode: OperatorType) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, newNode.id, () => newNode),
    );
  };

  const value = operator.combinator;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGuidance(
      collapsibleGuidanceKey("ToggleOperator", selected),
      true,
    );
    const nextValue = event.target.value as CombinatorType;

    handleToggleOperator({ ...operator, combinator: nextValue });
  };

  return (
    <FormControl>
      <RadioGroup
        aria-labelledby="toggle-exclusion"
        name="toggle-exclusion"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel
          value={CombinatorType.AND}
          control={<SquareRadio />}
          label="AND"
        />
        <FormControlLabel
          value={CombinatorType.OR}
          control={<SquareRadio />}
          label="OR"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default ToggleOperator;
