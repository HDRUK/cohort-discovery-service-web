"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Field,
  QueryBuilder as ReactQueryBuilder,
  defaultControlElements,
  ValueSelectorProps,
  ValueEditorProps,
  NotToggleProps,
  ActionWithRulesProps,
  RuleGroupHeaderComponents,
  RuleGroupBodyComponents,
  Rule,
} from "react-querybuilder";

import type { RuleProps, UseRuleGroup } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";
import { Add, Delete, Lock, LockOpen, ContentCopy } from "@mui/icons-material";

import { useDaphneStore } from "../store/useDaphneStore";
import {
  Skeleton,
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  Switch,
  Tooltip,
  TextField,
  FormControlLabel,
} from "@mui/material";

const fields: Field[] = [
  {
    name: "sex",
    label: "Sex",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [
      { name: "8507", label: "Male" },
      { name: "8532", label: "Female" },
      { name: "8551", label: "Other" },
    ],
  },
  {
    name: "age",
    label: "Age",
    inputType: "number",
    operators: ["=", ">", "<", ">=", "<=", "between"],
  },
  {
    name: "condition",
    label: "Condition",
    valueEditorType: "select",
    operators: ["=", "!="],
    values: [],
  },
  {
    name: "measurement",
    label: "Measurement",
    inputType: "string",
    //valueEditorType: "select",
    operators: ["=", "!=", ">", "<", ">=", "<=", "between"],
    values: [
      { name: "bmi", label: "BMI" },
      { name: "systolic_bp", label: "Systolic Blood Pressure" },
      { name: "a1c", label: "HbA1c (%)" },
      { name: "cholesterol", label: "Total Cholesterol (mg/dL)" },
    ],
  },
  {
    name: "drug_exposure",
    label: "Drug Exposure",
    inputType: "string",
    //valueEditorType: "select",
    operators: ["=", "!="],
    values: [
      { name: "metformin", label: "Metformin" },
      { name: "insulin", label: "Insulin" },
      { name: "atorvastatin", label: "Atorvastatin" },
    ],
  },
  {
    name: "observation",
    label: "Observation",
    inputType: "string",
    //valueEditorType: "select",
    operators: ["=", "!="],
    values: [
      { name: "former_smoker", label: "Former Smoker" },
      { name: "family_history_diabetes", label: "Family History of Diabetes" },
      { name: "wheelchair", label: "Uses Wheelchair" },
    ],
  },
];

const QueryBuilderSkeleton = () => (
  <Box sx={{ p: 2 }}>
    <Skeleton variant="rectangular" height={100} width="100%" sx={{ mb: 2 }} />
  </Box>
);

const CustomRuleGroupHeader = (rg: UseRuleGroup) => {
  return (
    <Box sx={{ display: "flex", gap: 2, my: 2 }}>
      <RuleGroupHeaderComponents {...rg} />
    </Box>
  );
};

const CustomRule = (props: RuleProps) => {
  return (
    <Box
      sx={{
        '& [data-testid="rule"]': {
          display: "flex",
          gap: 2,
        },
      }}
    >
      <Rule {...props} />
    </Box>
  );
};

const CustomRuleGroupBody = (rg: UseRuleGroup) => {
  return (
    <Box sx={{ display: "flex", gap: 2, my: 2, flexDirection: "column" }}>
      <RuleGroupBodyComponents {...rg} />
    </Box>
  );
};

const customControlElements = {
  ...defaultControlElements,
  addGroupAction: ({ handleOnClick }: ActionWithRulesProps) => (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleOnClick}
      startIcon={<Add />}
    >
      Add Group
    </Button>
  ),
  addRuleAction: ({ handleOnClick }: ActionWithRulesProps) => (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleOnClick}
      startIcon={<Add />}
    >
      Add Rule
    </Button>
  ),
  removeGroupAction: ({ handleOnClick }: ActionWithRulesProps) => (
    <IconButton onClick={handleOnClick} color="error">
      <Delete />
    </IconButton>
  ),
  removeRuleAction: ({ handleOnClick }: ActionWithRulesProps) => (
    <IconButton onClick={handleOnClick} color="error">
      <Delete />
    </IconButton>
  ),
  cloneRuleAction: ({ handleOnClick }: ActionWithRulesProps) => (
    <Tooltip title="Clone Rule">
      <IconButton onClick={handleOnClick}>
        <ContentCopy />
      </IconButton>
    </Tooltip>
  ),
  cloneGroupAction: ({ handleOnClick }: ActionWithRulesProps) => (
    <Tooltip title="Clone Group">
      <IconButton onClick={handleOnClick}>
        <ContentCopy />
      </IconButton>
    </Tooltip>
  ),
  lockRuleAction: ({ handleOnClick, disabled }: ActionWithRulesProps) => (
    <Tooltip title={disabled ? "Unlock Rule" : "Lock Rule"}>
      <IconButton onClick={handleOnClick}>
        {disabled ? <LockOpen /> : <Lock />}
      </IconButton>
    </Tooltip>
  ),
  lockGroupAction: ({ handleOnClick, disabled }: ActionWithRulesProps) => (
    <Tooltip title={disabled ? "Unlock Group" : "Lock Group"}>
      <IconButton onClick={handleOnClick}>
        {disabled ? <LockOpen /> : <Lock />}
      </IconButton>
    </Tooltip>
  ),
  fieldSelector: ({ options, value, handleOnChange }: ValueSelectorProps) => (
    <Select
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      size="small"
    >
      {options.map((opt) => (
        <MenuItem key={opt.name} value={opt.name}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  ),
  operatorSelector: ({
    options,
    value,
    handleOnChange,
  }: ValueSelectorProps) => (
    <Select
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      size="small"
    >
      {options.map((opt) => (
        <MenuItem key={opt.name} value={opt.name}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  ),
  combinatorSelector: ({
    options,
    value,
    className,
    handleOnChange,
  }: ValueSelectorProps) => (
    <Select
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      className={className}
      size="small"
    >
      {options.map((opt) => (
        <MenuItem key={opt.name} value={opt.name}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  ),
  valueSourceSelector: ({
    options,
    value,
    handleOnChange,
  }: ValueSelectorProps) => (
    <Select
      value={value}
      onChange={(e) => handleOnChange(e.target.value)}
      size="small"
    >
      {options.map((opt) => (
        <MenuItem key={opt.name} value={opt.name}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  ),

  valueEditor: ({ value, type, handleOnChange }: ValueEditorProps) => {
    //console.log(type);
    return (
      <TextField
        value={value}
        onChange={(e) => handleOnChange(e.target.value)}
      />
    );
  },

  notToggle: ({ checked, handleOnChange }: NotToggleProps) => (
    <FormControlLabel
      control={
        <Switch
          checked={checked}
          onChange={(e) => handleOnChange(e.target.checked)}
          color="primary"
        />
      }
      label="NOT"
      labelPlacement="end"
    />
  ),
  ruleGroupHeaderElements: CustomRuleGroupHeader,
  ruleGroupBodyElements: CustomRuleGroupBody,
  rule: CustomRule,
};

const QueryBuilder = () => {
  const { query, setQuery, isLoading, conditions } = useDaphneStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const hydratedFields = useMemo(() => {
    return fields.map((field) => {
      if (field.name === "condition") {
        return {
          ...field,
          values: conditions,
        };
      }
      return field;
    });
  }, [conditions]);

  if (!hasMounted || isLoading) {
    return <QueryBuilderSkeleton />;
  }

  return (
    <ReactQueryBuilder
      fields={hydratedFields}
      query={query}
      onQueryChange={setQuery}
      addRuleToNewGroups
      debugMode
      listsAsArrays
      parseNumbers="strict-limited"
      showCloneButtons
      showLockButtons
      showNotToggle
      controlClassnames={{
        queryBuilder: "queryBuilder-branches queryBuilder-justified",
      }}
      //controlElements={customControlElements}
    />
  );
};

export default QueryBuilder;
