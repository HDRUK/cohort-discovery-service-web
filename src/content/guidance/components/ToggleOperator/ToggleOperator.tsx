import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import SquareRadio from "@/components/SquareRadio";
import { CombinatorType, OperatorType, RuleLeafType } from "@/types/rules";
import { updateById } from "@/utils/rules";
import useQueryBuilder from "@/store/useQueryBuilder";

type ToggleOperatorProps = {
  operator: OperatorType;
};

const ToggleOperator = ({ operator }: ToggleOperatorProps) => {
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const handleToggleExclusion = (newNode: OperatorType) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, newNode.id, () => newNode)
    );
  };

  const value = operator.combinator;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value as CombinatorType;

    handleToggleExclusion({ ...operator, combinator: nextValue });
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
