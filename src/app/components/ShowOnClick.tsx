import { useState, ReactNode, ReactElement } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "./Modal";

interface ShowOnClickProps {
  children: ReactNode;
  icon?: ReactElement;
  tooltip?: string;
  modal?: boolean;
  dialogTitle?: string;
}

const ShowOnClick = ({
  children,
  icon,
  tooltip,
  modal = true,
  dialogTitle = "Details",
}: ShowOnClickProps) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Tooltip title={tooltip ?? (open ? "Hide" : "Show")}>
        <IconButton onClick={handleToggle} size="small">
          {icon ?? <ExpandMoreIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      {modal ? (
        <Modal open={open} onClose={handleClose} title={dialogTitle}>
          {children}
        </Modal>
      ) : (
        open && children
      )}
    </Box>
  );
};

export default ShowOnClick;
