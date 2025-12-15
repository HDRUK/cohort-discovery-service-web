import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  BaseSelectProps,
  InputAdornment,
  Chip,
  TextField,
  Stack,
} from "@mui/material";
import { ReactNode, useState } from "react";

export type ValueType = string | number;
export type OptionsType = {
  value: ValueType;
  label: string;
};

interface FormMultiSelectProps extends BaseSelectProps<OptionsType> {
  options: OptionsType[];
  startIcon?: ReactNode;
  onClear?: () => void;
  placeholder?: string;
  startAdornmentIcon?: ReactNode;
  field: {
    onChange: (value: any) => void;
    value: ValueType | ValueType[] | null;
    name?: string;
  };
  freeSolo?: boolean;
  id?: string;
  disabled?: boolean;
  isLoadingOptions?: boolean;
  getChipLabel?: (
    options: OptionsType[],
    value: OptionsType | string | number
  ) => string;
  canCreate?: boolean;
  filterOptions?: (
    options: OptionsType[],
    state: { inputValue: string }
  ) => OptionsType[];
  chipColor?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  noOptionsText?: ReactNode;
  clearIcon?: boolean;
  maxLabelLength?: number;
  tagsBelow?: boolean;
}

const MAX_DISPLAYED_TAGS = 20;

const FormMultiSelect = ({
  options,
  multiple = false,
  startIcon,
  onClear,
  placeholder,
  startAdornmentIcon,
  field,
  freeSolo,
  id,
  disabled = false,
  isLoadingOptions = false,
  getChipLabel,
  canCreate = false,
  filterOptions,
  chipColor,
  noOptionsText = "No options",
  clearIcon = false,
  maxLabelLength = 40,
  tagsBelow = false,
  ...restProps
}: FormMultiSelectProps) => {
  const [values, setValues] = useState<number[]>([]);

  const handleDelete = (value: any) => {
    const newValue = values.filter((v: any) => v !== value);
    field.onChange(newValue);
    setValues(newValue);
  };

  return (
    <>
      <Autocomplete
        id={id}
        {...field}
        value={field.value ?? {}}
        {...restProps}
        freeSolo={freeSolo}
        multiple={multiple}
        defaultValue={[]}
        getOptionLabel={(option) => {
          if (isLoadingOptions) return "Loading...";
          if (!option) return "";
          if (Array.isArray(option) && option.length === 0) return "";
          if (typeof option === "object") return option?.label;
          return (
            options.find((item) => item.value.toString() === option.toString())
              ?.label ?? option.toString()
          );
        }}
        isOptionEqualToValue={(option, value) =>
          option.value === value?.value || option.value === value
        }
        options={options}
        getOptionKey={(option) => option.value}
        disabled={disabled}
        limitTags={MAX_DISPLAYED_TAGS} // Make configurable
        onChange={(_, value) => {
          let newValue: ValueType | ValueType[] | null = null;
          console.log("before", newValue, value);
          if (Array.isArray(value)) {
            newValue = value.map((v) => (typeof v === "object" ? v.value : v));
          } else if (typeof value === "object" && value !== null) {
            newValue = value.value;
          } else {
            newValue = value;
          }
          newValue = [...new Set(newValue)];
          console.log("after", newValue, value);

          field.onChange(newValue);
          setValues(newValue);
        }}
        {...(tagsBelow && {
          renderValue: () => null,
        })} // Means we don't render the chips in the input
        {...(canCreate && {
          filterOptions,
        })}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ padding: 0 }}
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
                key={val}
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
    </>
  );
};
export default FormMultiSelect;
