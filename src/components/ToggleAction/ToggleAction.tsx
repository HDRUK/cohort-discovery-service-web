"use client";

import { ElementType } from "react";
import { Box, Stack } from "@mui/material";
import { SvgIconProps } from "@mui/material/SvgIcon";
import CircularIconButton from "@/components/CircularIconButton";

type IconComponent = ElementType<SvgIconProps>;

type ToggleActionProps = {
  active: boolean;
  onToggle: () => void;
  activeIcon: IconComponent;
  inactiveIcon: IconComponent;

  activeIconProps?: SvgIconProps;
  inactiveIconProps?: SvgIconProps;

  gap?: number;
  size?: number;
  buttonToIconRatio?: number;
};

export const ToggleAction = ({
  active,
  onToggle,
  activeIcon: ActiveIcon,
  inactiveIcon: InactiveIcon,
  activeIconProps,
  inactiveIconProps,
  gap = 0,
  size = 36,
  buttonToIconRatio = 0.6,
}: ToggleActionProps) => {
  const iconSize = size * buttonToIconRatio;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        maxWidth: "fit-content",

        "&::after": {
          content: '""',
          position: "absolute",
          left: size / 2,
          right: size / 2,
          top: "50%",
          transform: "translateY(-50%)",
          height: size * 0.5,
          bgcolor: "grey.300",
          zIndex: 0,
          pointerEvents: "none",
        },
      }}
    >
      <Stack direction={"row"} gap={gap}>
        <CircularIconButton
          component="div"
          disableRipple
          onClick={() => onToggle()}
          sx={{
            width: size,
            height: size,
            minWidth: size,
            minHeight: size,
            borderRadius: size,
            bgcolor: !active ? "white" : "grey.300",
            border: !active ? 1 : 0,
            boxShadow: !active ? "0px 6px 6px rgba(0, 0, 0, 0.4)" : undefined,
            "& svg": {
              transition: "transform 0.15s ease",
            },

            "&:hover svg": {
              transform: "scale(1.15)",
            },
            zIndex: 1,
          }}
        >
          <InactiveIcon
            {...inactiveIconProps}
            sx={{
              width: iconSize,
              height: iconSize,
              color: !active ? "error.main" : "white",
              ...(inactiveIconProps?.sx ?? {}),
            }}
          />
        </CircularIconButton>
        <CircularIconButton
          component="div"
          disableRipple
          onClick={() => onToggle()}
          sx={{
            width: size,
            height: size,
            minWidth: size,
            minHeight: size,
            borderRadius: size,
            bgcolor: active ? "white" : "grey.300",
            border: active ? 1 : 0,
            boxShadow: active ? "0px 6px 6px rgba(0, 0, 0, 0.4)" : undefined,
            zIndex: 1,
            "& svg": {
              transition: "transform 0.15s ease",
            },

            "&:hover svg": {
              transform: "scale(1.15)",
            },
          }}
        >
          <ActiveIcon
            {...activeIconProps}
            sx={{
              width: iconSize,
              height: iconSize,
              color: active ? "success.main" : "white",
              ...(activeIconProps?.sx ?? {}),
            }}
          />
        </CircularIconButton>
      </Stack>
    </Box>
  );
};
