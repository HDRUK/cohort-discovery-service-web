import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";

export const ROW_ITEM_HEIGHT = 40;
export const ROW_ITEM_HEIGHT_COMPRESSED = 30;
export const INDENT_STEP = 2;

export const listItemButtonSx =
  (
    isDragging: boolean,
    isOver: boolean,
    isAbove: boolean,
    depth: number,
    isSelected: boolean,
    isHovered: boolean,
    isNotAllowed: boolean = false,
  ): SxProps<Theme> =>
  (theme) => ({
    color: theme.palette.text.primary,
    minHeight: depth > 0 ? ROW_ITEM_HEIGHT_COMPRESSED : ROW_ITEM_HEIGHT,
    height: depth > 0 ? ROW_ITEM_HEIGHT_COMPRESSED : ROW_ITEM_HEIGHT,

    boxSizing: "border-box",

    outline: isDragging ? `1px dashed ${theme.palette.text.primary}` : "none",
    outlineOffset: -1,

    position: "relative",
    bgcolor: isSelected
      ? "background.default"
      : isHovered
        ? "highlight.main"
        : "none",
    "&.Mui-focusVisible": {
      bgcolor: isSelected ? "background.default" : "transparent",

      "&:hover": {
        bgcolor: isSelected ? "background.default" : "highlight.main",
      },
    },

    ...(isOver && {
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        height: 3,
        top: isAbove ? 0 : "auto",
        bottom: isAbove ? "auto" : 0,
        backgroundColor: isNotAllowed
          ? theme.palette.error.main
          : theme.palette.primary.main,
        pointerEvents: "none",
      },
    }),
    p: 0,
  });
