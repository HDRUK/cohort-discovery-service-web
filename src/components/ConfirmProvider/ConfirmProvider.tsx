"use client";

import React, {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Button, Typography } from "@mui/material";
import type { Breakpoint } from "@mui/material";
import Modal from "@/components/Modal";

type ConfirmTemplateProps = {
  action: string;
};
export type ConfirmFn = (options?: ConfirmOptions) => Promise<boolean>;

export const ConfirmContext = createContext<ConfirmFn | null>(null);

export type ConfirmOptions = {
  template?: "default";
  props?: ConfirmTemplateProps;

  // overrides
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  maxWidth?: Breakpoint;

  confirmColor?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  confirmVariant?: "text" | "outlined" | "contained";
};

function buildDefaultDescription(p?: ConfirmTemplateProps): React.ReactNode {
  const action = p?.action?.trim();
  if (!action) return "Are you sure?";
  return `Are you sure you want to ${action}?`;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState<
    Required<Omit<ConfirmOptions, "description" | "props" | "template">> & {
      description?: React.ReactNode;
      props?: ConfirmTemplateProps;
      template?: "default";
    }
  >({
    title: "Confirm",
    confirmText: "Confirm",
    cancelText: "Cancel",
    maxWidth: "xs",
    confirmColor: "primary",
    confirmVariant: "contained",
    description: undefined,
    props: undefined,
    template: "default",
  });

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const resolveAndClose = useCallback((value: boolean) => {
    setOpen(false);
    resolverRef.current?.(value);
    resolverRef.current = null;
  }, []);

  const confirm = useCallback<ConfirmFn>((options) => {
    if (resolverRef.current) resolverRef.current(false);

    const nextProps = options?.props;
    const derivedDescription =
      options?.description ??
      (options?.template === "default" || !options?.template
        ? buildDefaultDescription(nextProps)
        : undefined);

    setOpts((prev) => ({
      ...prev,
      ...(options ?? {}),
      title: options?.title ?? prev.title ?? "Confirm",
      confirmText: options?.confirmText ?? prev.confirmText ?? "Confirm",
      cancelText: options?.cancelText ?? prev.cancelText ?? "Cancel",
      maxWidth: options?.maxWidth ?? prev.maxWidth ?? "xs",
      confirmColor: options?.confirmColor ?? prev.confirmColor ?? "primary",
      confirmVariant:
        options?.confirmVariant ?? prev.confirmVariant ?? "contained",
      props: nextProps ?? prev.props,
      template: options?.template ?? prev.template,
      description: derivedDescription,
    }));

    setOpen(true);

    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const ctxValue = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={ctxValue}>
      {children}

      <Modal
        open={open}
        onClose={() => resolveAndClose(false)}
        title={opts.title}
        maxWidth={opts.maxWidth}
        showTitle
        showCloseButton
        showActions={false}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {typeof opts.description === "string" ? (
            <Typography>{opts.description}</Typography>
          ) : (
            opts.description
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              mt: 1,
            }}
          >
            <Button variant="outlined" onClick={() => resolveAndClose(false)}>
              {opts.cancelText}
            </Button>
            <Button
              onClick={() => resolveAndClose(true)}
              variant={opts.confirmVariant}
              color={opts.confirmColor}
            >
              {opts.confirmText}
            </Button>
          </Box>
        </Box>
      </Modal>
    </ConfirmContext.Provider>
  );
}
