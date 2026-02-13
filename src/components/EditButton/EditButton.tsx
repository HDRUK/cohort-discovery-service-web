import EditIcon from "@mui/icons-material/Edit";
import { Button, IconButton, IconButtonProps } from "@mui/material";
export interface EditButtonProps extends IconButtonProps {
  children?: React.ReactNode;
  label?: string;
}
const EditButton = ({ children, label, ...props }: EditButtonProps) =>
  label ? (
    <Button
      variant="text"
      startIcon={<EditIcon />}
      sx={{
        justifyContent: "flex-start",
        textAlign: "left",
        color: "text.primary",
      }}
      {...props}
    >
      {label}
    </Button>
  ) : (
    <IconButton {...props}>
      <EditIcon />
      {children}
    </IconButton>
  );

export default EditButton;
