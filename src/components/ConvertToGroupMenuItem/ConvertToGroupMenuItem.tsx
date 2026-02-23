import { Button, ButtonProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export interface ConvertToGroupMenuItemProps extends ButtonProps {
  label: string;
  action: () => void;
}

const ConvertToGroupMenuItem = ({
  label,
  action,
  ...rest
}: ConvertToGroupMenuItemProps) => (
  <Button
    variant="text"
    startIcon={<AddIcon />}
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

export default ConvertToGroupMenuItem;
