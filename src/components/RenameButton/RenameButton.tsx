"use client";

import { IconButton, IconButtonProps, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

export interface RenameButtonProps extends Omit<IconButtonProps, "onClick"> {
  tag?: string;
  label?: string;
  text?: string;
  onClick: (isEditing: boolean) => void;
}
const RenameButton = ({
  tag,
  label,
  text,
  onClick,
  ...rest
}: RenameButtonProps) => {
  const handleClick = () => {
    onClick?.(true);
  };
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
        startIcon: <EditIcon fontSize={"small"} />,
      };

  return (
    <ButtonComponent
      onClick={handleClick}
      {...specificButtonProps}
      {...rest}
      variant={!text ? undefined : "text"}
    >
      {!text && <EditIcon />}
      {text}
    </ButtonComponent>
  );
};

export default RenameButton;
