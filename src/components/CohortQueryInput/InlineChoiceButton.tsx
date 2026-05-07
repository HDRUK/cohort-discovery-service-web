"use client";

import { Button, ButtonProps } from "@mui/material";

type InlineChoiceButtonProps = ButtonProps;

const InlineChoiceButton = ({
  children,
  sx,
  ...props
}: InlineChoiceButtonProps) => {
  return (
    <Button
      variant="outlined"
      sx={{
        minWidth: 0,
        m: 0,
        p: 0,
        px: 0.75,
        py: 0,
        borderRadius: 20,
        borderColor: "text.secondary",
        color: "text.secondary",
        lineHeight: 1.4,
        boxSizing: "border-box",
        borderWidth: 1,
        textTransform: "none",
        transition:
          "background-color 120ms ease, border-color 120ms ease, color 120ms ease",

        "&:hover": {
          borderColor: "text.primary",
          color: "text.primary",
          borderWidth: 1,
          backgroundColor: "action.hover",
        },

        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default InlineChoiceButton;
