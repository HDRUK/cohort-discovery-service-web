import { Button, ButtonProps, IconButton } from "@mui/material";
import { DeleteIcon } from "@/icons/DeleteIcon";

export interface DeleteMenuItemProps extends ButtonProps {
  label?: string;
  action: () => void;
}

const DeleteMenuItem = ({ label, action, ...rest }: DeleteMenuItemProps) => {
  return (
    <>
      {label ? (
        <Button
          variant="text"
          startIcon={<DeleteIcon />}
          onClick={() => action()}
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            fontWeight: "normal",
            color: "text.primary",
            "&:hover": {
              backgroundColor: "highlight.main",
            },
          }}
          {...rest}
        >
          {label}
        </Button>
      ) : (
        <IconButton
          onClick={() => action()}
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            color: "text.primary",
            borderRadius: "100px",
            "&:hover": {
              backgroundColor: "highlight.main",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      )}
    </>
  );
};

export default DeleteMenuItem;
