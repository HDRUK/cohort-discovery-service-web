import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export interface AddButtonProps {
  label: string;
  action: () => void;
}

const AddButton = ({ label, action }: AddButtonProps) => (
  <Button
    variant="text"
    startIcon={<AddIcon />}
    onClick={() => action()}
    sx={{
      justifyContent: "flex-start",
      textAlign: "left",
      color: "text.primary",
    }}
  >
    {label}
  </Button>
);

export default AddButton;
