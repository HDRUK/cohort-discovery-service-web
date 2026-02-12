import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
  DialogProps,
  Breakpoint,
  Theme,
} from "@mui/material";
import { SxProps } from "@mui/system";

import CloseIcon from "@mui/icons-material/Close";
import { ReactNode } from "react";

export interface ModalProps extends Omit<DialogProps, "children"> {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: Breakpoint;
  showTitle?: boolean;
  showCloseButton?: boolean;
  closeButtonSx?: SxProps<Theme>;
  showActions?: boolean;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  additionalActions?: ReactNode;
}

const Modal = ({
  title = "Details",
  open,
  onClose,
  children,
  maxWidth = "md",
  showTitle = true,
  showCloseButton = true,
  closeButtonSx,
  showActions = true,
  actionLabel = "Close",
  secondaryActionLabel,
  onSecondaryAction,
  additionalActions,
  ...dialogProps
}: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      {...dialogProps}
    >
      {showTitle && (
        <DialogTitle
          variant="h3"
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
      )}
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
          <Button onClick={onClose} sx={closeButtonSx}>
            {actionLabel}
          </Button>
          {additionalActions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Modal;
