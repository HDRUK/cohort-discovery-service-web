import {
  Box,
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
  onClick: (e: React.MouseEvent) => void | Promise<void>;
  buttonSx?: ButtonProps["sx"];
  highlighted?: boolean;
};

const AddButton = ({
  label,
  onClick,
  disabled,
  buttonSx,
  highlighted = false,
  ...rest
}: AddButtonProps) => {
  const { compact } = useActionMenuSection();
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    if (loading) return;
    try {
      setLoading(true);
      await onClick(e);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = Boolean(disabled) || loading;

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      {compact ? (
        <Tooltip title={`Add ${label}`} disableHoverListener={!compact}>
          <span onClick={stopPropagation}>
            <IconButton disabled={isDisabled} onClick={handleClick}>
              {loading ? <CircularProgress size={20} /> : <AddIcon />}
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Box
          component="span"
          onClick={stopPropagation}
          sx={{ display: "inline-flex" }}
        >
          <Button
            variant="text"
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
            disabled={isDisabled}
            onClick={handleClick}
            sx={{
              justifyContent: "flex-start",
              textAlign: "left",
              color: "text.primary",
              ...(highlighted && { backgroundColor: "highlight.main" }),
              "&.MuiButton-root:hover": {
                backgroundColor: "highlight.main",
              },
              ...buttonSx,
            }}
            {...rest}
          >
            {label}
          </Button>
        </Box>
      )}
    </>
  );
};

export default AddButton;
