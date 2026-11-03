import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { IconButton, IconButtonProps } from "@mui/material";

export interface RestoreButtonProps extends IconButtonProps {
  children?: React.ReactNode;
  onClick: () => void;
}
const RestoreButton = ({ children, ...props }: RestoreButtonProps) => (
  <IconButton aria-label="Restore" {...props}>
    <RestoreFromTrashIcon data-testid="RestoreFromTrashIcon" />
    {children}
  </IconButton>
);

export default RestoreButton;
