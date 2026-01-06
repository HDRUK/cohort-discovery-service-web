import {
  FormLabelProps as MuiFormLabelProps,
  FormLabel as MuiFormLabel,
} from "@mui/material";

export interface FormLabelProps extends MuiFormLabelProps {
  labelRegular?: boolean;
  labelUnderlined?: boolean;
}

const FormLabel = ({
  labelRegular = true,
  labelUnderlined = false,
  sx,
  ...props
}: FormLabelProps) => {
  return (
    <MuiFormLabel
      {...props}
      sx={{
        ...(labelRegular ? { fontWeight: 400 } : null),
        ...(labelUnderlined ? { borderBottom: 1, mb: 1 } : null),
        ...sx,
      }}
    />
  );
};

export default FormLabel;
