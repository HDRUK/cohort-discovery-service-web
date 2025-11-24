import { useId } from "react";
import {
  FormControl,
  FormLabel,
  OutlinedTextFieldProps,
  TextField,
} from "@mui/material";

interface FormTextFieldProps extends Omit<OutlinedTextFieldProps, "variant"> {
  label?: string;
  required?: boolean;
}

const FormTextField = ({
  label,
  sx,
  id,
  required = false,
  ...props
}: FormTextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <FormControl fullWidth error={!!props.error} required={required}>
      {label && (
        <FormLabel htmlFor={inputId} required={required}>
          {label}
        </FormLabel>
      )}

      <TextField
        id={inputId}
        required={required}
        sx={{
          borderRadius: 0,
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: 0,
          },
          ...sx,
        }}
        {...props}
        variant="outlined"
      />
    </FormControl>
  );
};

export default FormTextField;
