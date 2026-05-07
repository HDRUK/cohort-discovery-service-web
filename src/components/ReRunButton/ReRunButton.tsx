"use client";

import { IconButton, IconButtonProps, Button } from "@mui/material";
import { ReRunIcon } from "@/icons/ReRunIcon";

export interface ReRunButtonProps extends Omit<IconButtonProps, "onClick"> {
  tag?: string;
  label?: string;
  text?: string;
  onClick: () => void;
}

const ReRunButton = ({
  tag,
  label,
  text,
  onClick,
  ...rest
}: ReRunButtonProps) => {
  const ButtonComponent = (!text ? IconButton : Button) as React.ElementType;

  const specificButtonProps = !text
    ? {
        sx: {
          bgcolor: "white",
          borderRadius: "50%",
          height: 36,
          width: 36,
        },
      }
    : {
        variant: "text",
        sx: {
          justifyContent: "flex-start",
          textAlign: "left",
          color: "text.primary",
          fontWeight: "normal",
          fontSize: 14,
          "&.MuiButton-root:hover": {
            backgroundColor: "highlight.main",
          },
        },
        startIcon: <ReRunIcon fontSize={"small"} />,
      };
  return (
    <ButtonComponent
      onClick={onClick}
      {...specificButtonProps}
      {...rest}
      variant={!text ? undefined : "text"}
    >
      {!text && <ReRunIcon />}
      {text}
    </ButtonComponent>
  );
};

export default ReRunButton;
