"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Snackbar, Alert, AlertColor, SnackbarOrigin } from "@mui/material";

const DEFAULT_ANCHOR_ORIGIN: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "right",
};

type NotifyArgs = {
  message: string;
  severity?: AlertColor; // "success" | "info" | "warning" | "error"
  autoHideDuration?: number | null; // ms, null = stays until dismissed
  anchorOrigin?: SnackbarOrigin;
};

export type NotifyFn = {
  (args: NotifyArgs): void;
  success: (message: string, autoHideDuration?: number) => void;
  info: (message: string, autoHideDuration?: number) => void;
  warning: (message: string, autoHideDuration?: number) => void;
  error: (message: string, autoHideDuration?: number) => void;
};

const NotifyContext = createContext<NotifyFn | null>(null);

export function useNotify(): NotifyFn {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error("useNotify must be used within <NotifyProvider />");
  return ctx;
}

export function NotifyProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<AlertColor>("success");
  const [autoHideDuration, setAutoHide] = useState<number | null>(3000);
  const [anchorOrigin, setAnchorOrigin] = useState<SnackbarOrigin>(
    DEFAULT_ANCHOR_ORIGIN,
  );

  const notifyBase = useCallback((args: NotifyArgs) => {
    setMessage(args.message);
    setSeverity(args.severity ?? "success");
    setAutoHide(
      args.autoHideDuration === undefined ? 3000 : args.autoHideDuration,
    );
    setAnchorOrigin(args.anchorOrigin ?? DEFAULT_ANCHOR_ORIGIN);
    setOpen(true);
  }, []);

  const notify: NotifyFn = useMemo(
    () =>
      Object.assign(((args: NotifyArgs) => notifyBase(args)) as NotifyFn, {
        success: (msg: string, dur?: number) =>
          notifyBase({
            message: msg,
            severity: "success",
            autoHideDuration: dur,
          }),
        info: (msg: string, dur?: number) =>
          notifyBase({ message: msg, severity: "info", autoHideDuration: dur }),
        warning: (msg: string, dur?: number) =>
          notifyBase({
            message: msg,
            severity: "warning",
            autoHideDuration: dur,
          }),
        error: (msg: string, dur?: number) =>
          notifyBase({
            message: msg,
            severity: "error",
            autoHideDuration: dur,
          }),
      }),
    [notifyBase],
  );

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        open={open}
        onClose={() => setOpen(false)}
        autoHideDuration={autoHideDuration}
        anchorOrigin={anchorOrigin}
        sx={{ mb: 5 }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
}
