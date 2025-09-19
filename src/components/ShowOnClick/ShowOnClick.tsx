import { useState, ReactNode, ReactElement } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "@/components/Modal";

interface ShowOnClickProps {
  children: ReactNode;
  icon?: ReactElement;
  tooltip?: string;
  modal?: boolean;
  disabled?: boolean;
  dialogTitle?: string;
  onSave?: () => Promise<void>;
}

const ShowOnClick = ({
  children,
  icon,
  tooltip,
  onSave,
  disabled = false,
  modal = true,
  dialogTitle = "Details",
}: ShowOnClickProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  const handleOnSave = async () => {
    await onSave?.();
    handleClose();
  };

  const button = (
    <IconButton onClick={handleToggle} size="small" disabled={disabled}>
      {icon ?? <ExpandMoreIcon fontSize="small" />}
    </IconButton>
  );

  return (
    <Box>
      {disabled ? (
        button
      ) : (
        <Tooltip title={tooltip ?? (open ? "Hide" : "Show")}>{button}</Tooltip>
      )}

      {!disabled &&
        (modal ? (
          <Modal
            open={open}
            onClose={handleClose}
            title={dialogTitle}
            {...(onSave && {
              secondaryActionLabel: "Save",
              onSecondaryAction: handleOnSave,
            })}
          >
            {children}
          </Modal>
        ) : (
          open && children
        ))}
    </Box>
  );
};

export default ShowOnClick;
