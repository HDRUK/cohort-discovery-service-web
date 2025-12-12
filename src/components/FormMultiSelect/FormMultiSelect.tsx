import {
  Autocomplete,
  BaseSelectProps,
  InputAdornment,
  ListItemText,
  Chip,
  TextField,
  Tooltip,
  Typography,
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
  ...restProps
}: FormMultiSelectProps) => {
  const [values, setValues] = useState<OptionsType[]>([]);

  return (
    <>
      <Autocomplete
        id={id}
        {...field}
        value={field.value ?? []}
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
        {...(!multiple && {
          isOptionEqualToValue: (option, value) =>
            option.value === value?.value || option.value === value,
        })}
        options={options}
        disabled={disabled}
        renderValue={(tagValue, getTagProps) => {
          const visibleOptions = tagValue.slice(0, MAX_DISPLAYED_TAGS);
          const additionalOptions = tagValue.length - visibleOptions.length;

          return [
            ...visibleOptions.map((option, index) => {
              const tagProps = getTagProps({ index });
              const { key, ...restTagProps } = tagProps;

              const rawLabel =
                typeof getChipLabel === "function"
                  ? getChipLabel(options, option)
                  : option?.label ?? String(option);

              const truncated =
                rawLabel && rawLabel.length > maxLabelLength
                  ? `${rawLabel.slice(0, maxLabelLength)}...`
                  : null;

              const label = truncated ?? rawLabel;
              const isTruncated = truncated !== null;

              const chip = (
                <Chip
                  label={label ?? ""}
                  size="small"
                  color={chipColor ?? undefined}
                  {...restTagProps}
                  key={option?.label}
                />
              );

              return isTruncated ? (
                <Tooltip key={key} title={rawLabel} enterDelay={400} arrow>
                  {/* Tooltip needs a single child */}
                  <span style={{ display: "inline-flex" }}>{chip}</span>
                </Tooltip>
              ) : (
                <span key={key} style={{ display: "inline-flex" }}>
                  {chip}
                </span>
              );
            }),
            additionalOptions > 0 ? (
              <Typography key="more" style={{ marginLeft: 4 }}>
                + {additionalOptions} more
              </Typography>
            ) : null,
          ];
        }}
        onChange={(_, value) => {
          let newValue: ValueType | ValueType[] | null = null;

          if (Array.isArray(value)) {
            newValue = value.map((v) => (typeof v === "object" ? v.value : v));
          } else if (typeof value === "object" && value !== null) {
            newValue = value.value;
          } else {
            newValue = value;
          }

          field.onChange(newValue);
        }}
        {...(canCreate && {
          filterOptions,
        })}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ padding: 0 }}
            placeholder={placeholder}
            InputProps={{
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
            }}
            size="small"
          />
        )}
        renderOption={(props, item) => (
          <li {...props} key={item.value as string}>
            <ListItemText>{item.label}</ListItemText>
          </li>
        )}
        noOptionsText={noOptionsText}
      />
      {/* {Array.isArray(values) &&
        values?.map((v) => (
          <Chip key={v.value} label={v.label} onDelete={onDelete(v.value)} />
        ))} */}
    </>
  );
};
export default FormMultiSelect;
