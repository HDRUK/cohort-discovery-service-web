import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import SquareRadio from "@/components/SquareRadio";
import { RuleLeafType } from "@/types/rules";
import { updateById } from "@/utils/rules";
import useQueryBuilder from "@/hooks/useQueryBuilder";
import React from "react";

type ToggleExclusionProps = {
  node: RuleLeafType;
  // show: boolean;
  children?: React.ReactNode;
};

const ToggleExclusionGuidance = ({
  node,
  // show,
  children,
}: ToggleExclusionProps) => {
  const { queryBuilderJson, setQueryBuilderJson, selectedGuidance } =
    useQueryBuilder((qb) => ({
      queryBuilderJson: qb.queryBuilderJson,
      setQueryBuilderJson: qb.setQueryBuilderJson,
      selectedGuidance: qb.selectedGuidance,
    }));

  // const handleToggleExclusion = (newNode: RuleLeafType) => {
  //   setQueryBuilderJson(
  //     updateById(queryBuilderJson, newNode.id, () => newNode),
  //   );
  // };

  const value = node?.exclude ? 0 : 1;

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const nextValue = Number(event.target.value);
  //   const nextExclude = nextValue === 0;
  //   handleToggleExclusion({ ...node, exclude: nextExclude });
  // };
  // if (!show) return null;
  if (selectedGuidance === node.id) return children;
  return null;
};

export default ToggleExclusionGuidance;
