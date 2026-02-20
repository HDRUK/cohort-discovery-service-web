import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, IconButtonProps } from "@mui/material";
export interface EditButtonProps extends IconButtonProps {
  children?: React.ReactNode;
  label?: string;
  isIcon?: boolean;
}
const EditButton = ({ children, label, isIcon, ...rest }: EditButtonProps) => {
  const ButtonComponent = (isIcon ? IconButton : Button) as React.ElementType;

  const specificButtonProps = isIcon
    ? {
        sx: {
          bgcolor: "white",
          borderRadius: "50%",
          height: 36,
          width: 36,
        },
      }
    : {
        variant: "text",
        sx: {
          justifyContent: "flex-start",
          textAlign: "left",
          color: "text.primary",
        },
        startIcon: <EditIcon fontSize={"small"} />,
      };

  return (
    <ButtonComponent {...specificButtonProps} {...rest}>
      {isIcon && <EditIcon />}
      {label}
    </ButtonComponent>
  );
};

export default EditButton;
