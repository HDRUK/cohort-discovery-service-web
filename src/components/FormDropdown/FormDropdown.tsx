import { Chip, ChipProps, MenuItem, Stack } from "@mui/material";
import FormTextField from "../FormTextField";
import { FormTextFieldProps } from "../FormTextField/FormTextField";
import { Option } from "@/types/common";

interface FormDropdownProps extends FormTextFieldProps {
  options: Option[];
  renderValue?: (value: FormTextFieldProps["value"]) => React.ReactNode;
  renderSelectedOption?: (option: Option) => React.ReactNode;
  renderMenuOption?: (option: Option) => React.ReactNode;
  placeHolderOption?: React.ReactNode;
  chipColor?: ChipProps["color"];
}

const defaultRenderOption = (
  opt: Option,
  color: ChipProps["color"] = "primary"
) => <Chip label={opt.label} size="small" color={color} />;

const defaultRenderValue = (
  value: FormTextFieldProps["value"],
  options: Option[],
  renderSelectedOption: (option: Option) => React.ReactNode
) => {
  const option = options.find((opt) => opt.value === value);

  if (!option) return null;

  return (
    <Stack direction="row" spacing={1}>
      {renderSelectedOption(option)}
    </Stack>
  );
};

const FormDropdown = ({
  options,
  placeHolderOption,
  renderValue,
  renderSelectedOption,
  renderMenuOption,
  slotProps,
  value,
  chipColor = "primary",
  ...rest
}: FormDropdownProps) => {
  const resolvedRenderSelectedOption =
    renderSelectedOption ??
    ((opt: Option) => defaultRenderOption(opt, chipColor));

  const resolvedRenderMenuOption =
    renderMenuOption ?? resolvedRenderSelectedOption;

  const resolvedRenderValue =
    renderValue ??
    ((currentValue: FormTextFieldProps["value"]) =>
      defaultRenderValue(currentValue, options, resolvedRenderSelectedOption));

  return (
    <FormTextField
      {...rest}
      value={value}
      slotProps={{
        ...slotProps,
        htmlInput: {
          ...(slotProps?.htmlInput ?? {}),
          renderValue: resolvedRenderValue,
        },
      }}
    >
      {placeHolderOption}
      {options.map((opt) => (
        <MenuItem key={opt.value ?? opt.label} value={opt.value ?? opt.label}>
          {resolvedRenderMenuOption(opt)}
        </MenuItem>
      ))}
    </FormTextField>
  );
};

export default FormDropdown;
