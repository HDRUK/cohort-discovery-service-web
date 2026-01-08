import { Button, ButtonProps, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useActionMenuSection } from "../ActionMenuSection";

export interface AddButtonProps extends ButtonProps {
  label: string;
  action: () => void;
}

const AddButton = ({ label, action, ...rest }: AddButtonProps) => {
  const { compact } = useActionMenuSection();

  return (
    <>
      {compact ? (
        <Tooltip title={`Add ${label}`} disableHoverListener={!compact}>
          <IconButton onClick={() => action()}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      ) : (
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
      )}
    </>
  );
};

export default AddButton;
