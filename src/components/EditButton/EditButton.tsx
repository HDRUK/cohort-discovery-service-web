import EditIcon from "@mui/icons-material/Edit";
import { IconButton, IconButtonProps } from "@mui/material";
export interface EditButtonProps extends IconButtonProps {
  children?: React.ReactNode;
}
const EditButton = ({ children, ...props }: EditButtonProps) => (
  <IconButton {...props}>
    <EditIcon />
    {children}
  </IconButton>
);

export default EditButton;
