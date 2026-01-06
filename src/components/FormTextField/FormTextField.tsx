import { useId } from "react";
import {
  Box,
  FormControl,
  IconButton,
  OutlinedTextFieldProps,
  Stack,
  TextField,
} from "@mui/material";
import FormLabel from "@/components/FormLabel";
import { useNotify } from "@/providers/NotifyProvider";
import { CopyAllOutlined } from "@mui/icons-material";
import { FieldError } from "react-hook-form";

export interface FormTextFieldProps
  extends Omit<OutlinedTextFieldProps, "variant" | "error"> {
  label?: string;
  required?: boolean;
  copyable?: boolean;
  error?: FieldError;
  labelRegular?: boolean;
  labelUnderlined?: boolean;
}

const FormTextField = ({
  label,
  sx,
  id,
  required = false,
  copyable = false,
  error,
  labelRegular = true,
  labelUnderlined = false,
  ...props
}: FormTextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const notify = useNotify();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(String(props.value));
    notify.success("Copied to clipboard");
  };

  return (
    <FormControl fullWidth error={!!error} required={required}>
      {label && (
        <FormLabel
          htmlFor={inputId}
          required={required}
          labelRegular={labelRegular}
          labelUnderlined={labelUnderlined}
        >
          {label}
        </FormLabel>
      )}

      <Stack direction="row" alignItems="center">
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
          error={!!error}
          helperText={error?.message}
          {...props}
          variant="outlined"
        />
        {copyable && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton onClick={handleCopy}>
              <CopyAllOutlined />
            </IconButton>
          </Box>
        )}
      </Stack>
    </FormControl>
  );
};

export default FormTextField;
