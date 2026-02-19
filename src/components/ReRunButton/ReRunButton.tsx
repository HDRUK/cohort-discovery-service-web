"use client";

import { IconButton, IconButtonProps, Button } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";

export interface ReRunButtonProps extends Omit<IconButtonProps, "onClick"> {
  tag?: string;
  showTooltip?: boolean;
  label?: string;
  text?: string;
  onClick: () => void;
}

const ReRunButton = ({
  tag,
  label,
  text,
  onClick,
  showTooltip = false,
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
        },
        startIcon: <CachedIcon fontSize={"small"} />,
      };
  return (
    <ButtonComponent
      onClick={onClick}
      {...specificButtonProps}
      {...rest}
      variant={!text ? undefined : "text"}
    >
      {!text && <CachedIcon />}
      {text}
    </ButtonComponent>
  );
};

export default ReRunButton;
