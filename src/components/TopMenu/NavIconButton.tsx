"use client";

import { ElementType } from "react";
import { IconButton, IconButtonProps } from "@mui/material";

import { mergeSx } from "@/utils/helpers";

type Props = IconButtonProps & {
  selected: boolean;
  component?: ElementType;
  href?: string;
};

const NavIconButton = ({ selected, sx, ...props }: Props) => (
  <IconButton
    {...props}
    sx={mergeSx(
      (theme) => ({
        width: 50,
        height: "100%",
        borderRadius: 0,
        color: theme.palette.tooltip?.main,
        ...(selected && {
          color: theme.palette.secondary.contrastText,
          bgcolor: theme.palette.secondary.main,
          "&:hover": { bgcolor: theme.palette.secondary.main },
        }),
      }),
      sx,
    )}
  />
);

export default NavIconButton;
