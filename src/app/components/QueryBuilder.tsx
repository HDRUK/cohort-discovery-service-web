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

  valueEditor: ({ value, type, handleOnChange, values }: ValueEditorProps) => {
    switch (type) {
      case "select":
        return (
          <Select
            value={value}
            onChange={(e) => handleOnChange(e.target.value)}
            size="small"
          >
            {(values ?? []).map((opt) => (
              <MenuItem key={opt.name} value={opt.name}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
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
        return (
          <TextField
            value={value}
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
      //controlElements={customControlElements}
    />
  );
};

export default QueryBuilder;
