"use client";

import { useState } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormTextField, { FormTextFieldProps } from "@/components/FormTextField";

export type FormPasswordFieldProps = Omit<FormTextFieldProps, "type">;

const FormPasswordField = ({ slotProps, ...props }: FormPasswordFieldProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <FormTextField
      {...props}
      type={visible ? "text" : "password"}
      slotProps={{
        ...slotProps,
        input: {
          ...(slotProps?.input ?? {}),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={visible ? "Hide password" : "Show password"}
                onClick={() => setVisible((current) => !current)}
                edge="end"
                size="small"
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export default FormPasswordField;
