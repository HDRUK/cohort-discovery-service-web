import { Button, ButtonProps } from "@mui/material";
import { DeleteIcon } from "@/icons/DeleteIcon";

export interface DeleteMenuItemProps extends ButtonProps {
  label: string;
  action: () => void;
}

const DeleteMenuItem = ({ label, action, ...rest }: DeleteMenuItemProps) => (
  <Button
    variant="text"
    startIcon={<DeleteIcon />}
    onClick={() => action()}
    sx={{
      justifyContent: "flex-start",
      textAlign: "left",
      color: "text.primary",
    }}
    {...rest}
  >
    {label}
  </Button>
);

export default DeleteMenuItem;
