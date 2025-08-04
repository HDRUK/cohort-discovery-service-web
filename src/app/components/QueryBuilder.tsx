"use client";

import { useEffect, useState } from "react";
import {
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
  Autocomplete,
  createFilterOptions,
} from "@mui/material";

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

  valueEditor: ({
    value,
    type,
    handleOnChange,
    values,
    operator,
    inputType,
    ...rest
  }: ValueEditorProps) => {
    console.log(value, type, operator, rest);

    switch (type) {
      case "select":
        const filterOptions = createFilterOptions({
          stringify: (option) => `${option.name} ${option.label}`,
        });

        return (
          <Autocomplete
            options={values ?? []}
            getOptionLabel={(option) => option.label}
            value={(values ?? []).find((v) => v.name === value) || null}
            onChange={(_, newValue) => handleOnChange(newValue?.name ?? "")}
            renderInput={(params) => (
              <TextField {...params} label="Select option" size="small" />
            )}
            size="small"
            isOptionEqualToValue={(option, val) => option.name === val.name}
            filterOptions={filterOptions}
            sx={{ minWidth: 400, maxWidth: 500 }}
          />
        );
      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleOnChange(e.target.checked)}
                color="primary"
              />
            }
            label="Value"
          />
        );
      case "textarea":
        return (
          <TextField
            multiline
            minRows={3}
            value={value}
            onChange={(e) => handleOnChange(e.target.value)}
            size="small"
          />
        );
      default:
        if (Array.isArray(value)) {
          const isNumericArray = value.every((v) => typeof v === "number");

          if (
            operator === "between" &&
            value.every((v) => typeof v === "number")
          ) {
            return (
              <>
                <TextField
                  type="number"
                  label="From"
                  value={value[0]}
                  onChange={(e) => {
                    const newValues = [...value];
                    newValues[0] = Number(e.target.value);
                    handleOnChange(newValues);
                  }}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <TextField
                  type="number"
                  label="To"
                  value={value[1] || 0}
                  onChange={(e) => {
                    const newValues = [...value];
                    newValues[1] = Number(e.target.value);
                    handleOnChange(newValues);
                  }}
                  size="small"
                />
              </>
            );
          }

          const isMultiValueOperator = ["in", "notIn"].includes(operator);

          if (isMultiValueOperator) {
            return (
              <>
                {value.map((val, index) => (
                  <TextField
                    key={index}
                    type={isNumericArray ? "number" : "text"}
                    value={val}
                    onChange={(e) => {
                      const newValues = [...value];
                      newValues[index] = isNumericArray
                        ? Number(e.target.value)
                        : e.target.value;
                      handleOnChange(newValues);
                    }}
                    size="small"
                  />
                ))}
              </>
            );
          }
        }

        return (
          <TextField
            value={value}
            type={inputType || "text"}
            onChange={(e) => handleOnChange(e.target.value)}
            size="small"
          />
        );
    }
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
  const { queryBuilderJson, setQueryBuilderJson, isLoading, fields } =
    useDaphneStore();

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted || isLoading) {
    return <QueryBuilderSkeleton />;
  }

  return (
    <ReactQueryBuilder
      fields={fields}
      query={queryBuilderJson}
      onQueryChange={setQueryBuilderJson}
      addRuleToNewGroups
      debugMode
      listsAsArrays
      parseNumbers="strict-limited"
      showCloneButtons
      showLockButtons
      showNotToggle
      controlClassnames={{
        queryBuilder: "queryBuilder-branches ",
      }}
      controlElements={customControlElements}
    />
  );
};

export default QueryBuilder;
