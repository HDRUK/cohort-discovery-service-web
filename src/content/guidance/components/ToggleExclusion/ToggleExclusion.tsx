import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import SquareRadio from "@/components/SquareRadio";
import { RuleLeafType } from "@/types/rules";
import { updateById } from "@/utils/rules";
import useQueryBuilder from "@/store/useQueryBuilder";

type ToggleExclusionProps = {
  node: RuleLeafType;
};

const ToggleExclusion = ({ node }: ToggleExclusionProps) => {
  const { queryBuilderJson, setQueryBuilderJson } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
  }));

  const handleToggleExclusion = (newNode: RuleLeafType) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, newNode.id, () => newNode)
    );
  };

  const value = node?.exclude ? 0 : 1;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    const nextExclude = nextValue === 0;
    handleToggleExclusion({ ...node, exclude: nextExclude });
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
          value={1}
          control={<SquareRadio />}
          label="Including"
        />
        <FormControlLabel
          value={0}
          control={<SquareRadio />}
          label="Excluding"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default ToggleExclusion;
