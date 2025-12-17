import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  BaseSelectProps,
  InputAdornment,
  Chip,
  TextField,
  Stack,
  FormControl,
  FormLabel,
} from "@mui/material";
import { ReactNode, useEffect, useId, useState } from "react";
import { FieldError } from "react-hook-form";

export type ValueType = number | string;
export type OptionsType = {
  value: ValueType;
  label: string;
};

interface FormMultiSelectProps
  extends Omit<BaseSelectProps<OptionsType>, "onChange" | "value" | "error"> {
  label?: string;
  options: OptionsType[];
  startIcon?: ReactNode;
  placeholder?: string;
  startAdornmentIcon?: ReactNode;
  onChange: (value: OptionsType | OptionsType[]) => void;
  value: OptionsType | OptionsType[] | null;
  id?: string;
  disabled?: boolean;
  getChipLabel?: (options: OptionsType[], value: OptionsType) => string;
  chipColor?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  noOptionsText?: ReactNode;
  maxLabelLength?: number;
  tagsBelow?: boolean;
  required?: boolean;
  error?: FieldError;
}

const MAX_DISPLAYED_TAGS = 20;

const FormMultiSelect = ({
  label,
  options,
  multiple = false,
  startIcon,
  placeholder,
  startAdornmentIcon,
  onChange,
  value,
  id,
  disabled = false,
  getChipLabel,
  chipColor,
  noOptionsText = "No options",
  maxLabelLength = 40,
  tagsBelow = false,
  required = false,
  error,
  sx,
  ...restProps
}: FormMultiSelectProps) => {
  const [values, setValues] = useState<OptionsType[]>([]);
  const [prevDisabled, setPrevDisabled] = useState<boolean>(disabled);

  const generatedId = useId();
  const inputId = id ?? generatedId;

  const handleDelete = (value: OptionsType) => {
    const newValue = values.filter((v: OptionsType) => v.value !== value.value);

    onChange(newValue);
    setValues(newValue);
  };

  if (disabled !== prevDisabled) {
    setPrevDisabled(disabled);
    setValues([]);
  }

  return (
    <FormControl fullWidth error={!!error} required={required}>
      {label && (
        <FormLabel htmlFor={inputId} required={required}>
          {label}
        </FormLabel>
      )}

      <Autocomplete
        id={id}
        value={value}
        {...restProps}
        multiple={multiple}
        getOptionLabel={(option) => {
          if (!option) return "";
          if (Array.isArray(option) && option.length === 0) return "";
          if (typeof option === "object") return option?.label;
          return (
            options.find((item) => item.value.toString() === option)?.label ??
            (option as string).toString()
          );
        }}
        isOptionEqualToValue={(option, value) => option.value === value?.value}
        options={options}
        getOptionKey={(option) => option.value}
        disabled={disabled}
        limitTags={MAX_DISPLAYED_TAGS} // Make configurable later
        onChange={(_, value) => {
          let newValue: OptionsType[] | null = null;
          if (Array.isArray(value)) {
            newValue = value;
          } else if (typeof value === "object" && value !== null) {
            newValue = [value];
          } else {
            newValue = [];
          }
          if (multiple) {
            newValue = [...new Set(newValue)];
          }

          onChange(newValue);
          setValues(newValue);
        }}
        {...(tagsBelow && {
          renderValue: () => null,
        })}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              borderRadius: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: 0,
              },
              padding: 0,
              ...sx,
            }}
            placeholder={placeholder}
            slotProps={{
              input: {
                ...params.InputProps,
                ...(startAdornmentIcon && {
                  startAdornment: (
                    <>
                      <InputAdornment
                        sx={{ my: "16px", pl: "5px" }}
                        position="start"
                      >
                        {startAdornmentIcon}
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }),
              },
            }}
            size="small"
          />
        )}
        noOptionsText={noOptionsText}
      />
      {tagsBelow && values && values.length > 0 && (
        <Stack>
          {values.map((val) => {
            return (
              <Chip
                key={val.value}
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "14px",
                    }}
                  >
                    <Close
                      onClick={() => handleDelete(val)}
                      sx={{ cursor: "pointer", color: "#D0D3D4" }}
                    />
                    {getChipLabel
                      ? getChipLabel(options, val)
                      : val.label.length > maxLabelLength
                      ? val.label.substring(0, maxLabelLength) + "..."
                      : val.label}
                  </div>
                }
                color={chipColor}
                sx={{
                  m: 0.5,
                  backgroundColor: "#FAFAFA",
                  justifyContent: "left",
                  fontWeight: 400,
                }}
              />
            );
          })}
        </Stack>
      )}
    </FormControl>
  );
};
export default FormMultiSelect;
