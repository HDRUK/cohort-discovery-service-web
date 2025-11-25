import { useId } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  IconButton,
  OutlinedTextFieldProps,
  Stack,
  TextField,
} from "@mui/material";
import { useNotify } from "@/providers/NotifyProvider";
import { CopyAllOutlined } from "@mui/icons-material";

interface FormTextFieldProps extends Omit<OutlinedTextFieldProps, "variant"> {
  label?: string;
  required?: boolean;
  copyable?: boolean;
}

const FormTextField = ({
  label,
  sx,
  id,
  required = false,
  copyable = false,
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
    <FormControl fullWidth error={!!props.error} required={required}>
      {label && (
        <FormLabel htmlFor={inputId} required={required}>
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
