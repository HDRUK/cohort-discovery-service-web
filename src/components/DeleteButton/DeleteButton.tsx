import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, IconButtonProps } from "@mui/material";

export interface DeleteButtonProps extends IconButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
}
const DeleteButton = ({ children, ...props }: DeleteButtonProps) => (
  <IconButton {...props}>
    <DeleteIcon data-testid="DeleteIcon" />
    {children}
  </IconButton>
);

export default DeleteButton;
