import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { ValueEditorProps } from "react-querybuilder";
import { Option } from "react-querybuilder";

type States = boolean | number | string | number[];

const ValueEditor = ({
  value: propValue,
  type,
  handleOnChange,
  values,
  operator,
  inputType,
}: ValueEditorProps) => {
  const [internalValue, setInternalValue] = useState<States>(propValue);

  useEffect(() => {
    setInternalValue(propValue);
  }, [propValue]);

  useEffect(() => {
    if (operator === "between" && !Array.isArray(internalValue)) {
      const normalized = [Number(internalValue || 0), 0];
      setInternalValue(normalized);
      handleOnChange(normalized);
    } else if (operator !== "between" && Array.isArray(internalValue)) {
      const normalized = internalValue[0] ?? "";
      setInternalValue(normalized);
      handleOnChange(normalized);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operator]);

  const handleValueChange = (val: States) => {
    setInternalValue(val);
    handleOnChange(val);
  };

  switch (type) {
    case "select":
      const filterOptions = createFilterOptions({
        stringify: (option: Option) => `${option.name} ${option.label}`,
      });

      return (
        <Autocomplete
          options={values ?? []}
          getOptionLabel={(option) => option.label}
          value={(values ?? []).find((v) => v.name === internalValue) || null}
          onChange={(_, newValue) => handleValueChange(newValue?.name ?? "")}
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
              checked={!!internalValue}
              onChange={(e) => handleValueChange(e.target.checked)}
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
          value={internalValue}
          onChange={(e) => handleValueChange(e.target.value)}
          size="small"
        />
      );

    default:
      if (
        operator === "between" &&
        Array.isArray(internalValue) &&
        inputType === "number"
      ) {
        return (
          <>
            <TextField
              type="number"
              label="From"
              value={internalValue[0]}
              onChange={(e) => {
                const newValues = [...internalValue];
                newValues[0] = Number(e.target.value);
                handleValueChange(newValues);
              }}
              size="small"
              sx={{ mr: 1 }}
            />
            <TextField
              type="number"
              label="To"
              value={internalValue[1]}
              onChange={(e) => {
                const newValues = [...internalValue];
                newValues[1] = Number(e.target.value);
                handleValueChange(newValues);
              }}
              size="small"
            />
          </>
        );
      }

      return (
        <TextField
          value={
            inputType === "number"
              ? Number(
                  Array.isArray(internalValue)
                    ? internalValue[0]
                    : internalValue
                )
              : internalValue
          }
          type={inputType || "text"}
          onChange={(e) => handleValueChange(e.target.value)}
          size="small"
        />
      );
  }
};

export default ValueEditor;
