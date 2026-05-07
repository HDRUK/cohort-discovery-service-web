import {
  Button,
  ButtonProps,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useActionMenuSection } from "../ActionMenuSection";
import { useState } from "react";

export type AddButtonProps = Omit<ButtonProps, "action" | "onClick"> & {
  label: string;
  onClick: () => void | Promise<void>;
};

const AddButton = ({ label, onClick, disabled, ...rest }: AddButtonProps) => {
  const { compact } = useActionMenuSection();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = Boolean(disabled) || loading;

  return (
    <>
      {compact ? (
        <Tooltip title={`Add ${label}`} disableHoverListener={!compact}>
          <span>
            <IconButton disabled={isDisabled} onClick={handleClick}>
              {loading ? <CircularProgress size={20} /> : <AddIcon />}
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Button
          variant="text"
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          disabled={isDisabled}
          onClick={handleClick}
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            color: "text.primary",
            "&.MuiButton-root:hover": {
              backgroundColor: "highlight.main",
            },
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
