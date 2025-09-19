import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  DialogProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

interface ModalProps extends Omit<DialogProps, "children"> {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  showActions?: boolean;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

const Modal = ({
  title = "Details",
  open,
  onClose,
  children,
  showCloseButton = true,
  showActions = true,
  actionLabel = "Close",
  secondaryActionLabel,
  onSecondaryAction,
  ...dialogProps
}: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      {...dialogProps}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        {showCloseButton && (
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {showActions && (
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {secondaryActionLabel && onSecondaryAction && (
            <Button onClick={onSecondaryAction} variant="contained">
              {secondaryActionLabel}
            </Button>
          )}
          <Button onClick={onClose}>{actionLabel}</Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
