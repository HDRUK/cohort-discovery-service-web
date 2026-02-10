import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import SquareRadio from "@/components/SquareRadio";
import { RuleLeafType } from "@/types/rules";
import { updateById } from "@/utils/rules";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import { ClickAwayListener } from "@mui/material";

type ToggleExclusionProps = {
  node: RuleLeafType;
};

const ToggleExclusion = ({ node }: ToggleExclusionProps) => {
  const {
    queryBuilderJson,
    setQueryBuilderJson,
    selectedGuidance,
    setSelectedGuidance,
    selected,
  } = useQueryBuilder((qb) => ({
    queryBuilderJson: qb.queryBuilderJson,
    setQueryBuilderJson: qb.setQueryBuilderJson,
    setSelectedGuidance: qb.setSelectedGuidance,
    selectedGuidance: qb.selectedGuidance,
    selected: qb.selected,
  }));

  const handleToggleExclusion = (newNode: RuleLeafType) => {
    setQueryBuilderJson(
      updateById(queryBuilderJson, newNode.id, () => newNode),
    );
  };

  const value = node?.exclude ? 0 : 1;
  // console.log("ToggleExclusion node.id", node.id);
  const keySuffix =
    Object.keys(selected).length === 1 ? Object.keys(selected)[0] : "multiple";
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGuidance(`ToggleExclusion-${keySuffix}`, true);
    const nextValue = Number(event.target.value);
    const nextExclude = nextValue === 0;
    handleToggleExclusion({ ...node, exclude: nextExclude });
  };

  return (
    // <ClickAwayListener
    //   onClickAway={() => {
    //     // if (selectedGuidance === "ToggleExclusion") {
    //     console.log("clickaway ToggleExclusion");
    //     setSelectedGuidance(`ToggleExclusion-${keySuffix}`, false);
    //     // }
    //   }}
    // >
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
    // </ClickAwayListener>
  );
};

export default ToggleExclusion;
