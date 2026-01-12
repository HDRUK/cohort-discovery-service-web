import { useId, ReactNode, ReactElement } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  RadioGroupProps,
} from "@mui/material";

type RadioOption = {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
};

interface FormRadioGroupProps extends Omit<RadioGroupProps, "children"> {
  label: string;
  required?: boolean;
  options: RadioOption[];
  error?: boolean;
  control?: ReactElement;
}

const FormRadioGroup = ({
  label,
  sx,
  id,
  required = false,
  options,
  error,
  control,
  ...radioGroupProps
}: FormRadioGroupProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FormControl fullWidth error={!!error} required={required}>
      <FormLabel htmlFor={inputId} id={`${inputId}-label`} required={required}>
        {label}
      </FormLabel>

      <RadioGroup
        id={inputId}
        aria-labelledby={`${inputId}-label`}
        sx={sx}
        {...radioGroupProps}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value || ""}
            value={option.value}
            control={control || <Radio />}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default FormRadioGroup;
