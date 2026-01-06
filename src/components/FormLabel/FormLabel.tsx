import {
  FormLabelProps as MuiFormLabelProps,
  FormLabel as MuiFormLabel,
} from "@mui/material";

export interface FormLabelProps extends MuiFormLabelProps {
  regular?: boolean;
  underlined?: boolean;
}

const FormLabel = ({
  regular = true,
  underlined = false,
  sx,
  ...props
}: FormLabelProps) => {
  return (
    <MuiFormLabel
      {...props}
      sx={{
        ...(regular ? { fontWeight: 400 } : null),
        ...(underlined ? { borderBottom: 1, mb: 1 } : null),
        ...sx,
      }}
    />
  );
};

export default FormLabel;
