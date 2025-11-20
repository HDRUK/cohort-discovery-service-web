import { useId } from "react";
import {
  FormControl,
  FormLabel,
  OutlinedTextFieldProps,
  TextField,
} from "@mui/material";

interface FormTextFieldProps extends Omit<OutlinedTextFieldProps, "variant"> {
  label: string;
}

const FormTextField = ({ label, sx, id, ...props }: FormTextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FormControl fullWidth error={!!props.error}>
      <FormLabel htmlFor={inputId}>{label}</FormLabel>
      <TextField
        id={inputId}
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
        variant={"outlined"}
      />
    </FormControl>
  );
};

export default FormTextField;
