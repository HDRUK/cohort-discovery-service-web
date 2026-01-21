import { SxProps, Theme } from "@mui/material/styles";

const HEIGHT = 10;

export const getContainerSx =
  (
    collapsible: boolean,
    expanded: boolean,
    expandedWidth: number | string,
    collapsedWidth: number | string,
  ): SxProps<Theme> =>
  (theme: Theme) => ({
    width: collapsible
      ? expanded
        ? expandedWidth
        : collapsedWidth
      : expandedWidth,
    transition: collapsible
      ? theme.transitions.create("width", {
          duration: 250,
          easing: theme.transitions.easing.easeInOut,
        })
      : "none",
  });

export const getTextFieldSx = (
  collapsible: boolean,
  expanded: boolean,
  inputBgColor: string,
  hasWarning: boolean = false,
): SxProps<Theme> => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 20,
    boxShadow: "0px 2px 2px rgba(0, 0, 0, 0.23)",
    backgroundColor: inputBgColor,
    px: 0,
    py: 0.5,
  },

  "& .MuiOutlinedInput-notchedOutline": {
    zIndex: 0,
    border: 0,
    opacity: collapsible ? (expanded ? 1 : 0) : 1,
    transition: collapsible ? "opacity 150ms" : "none",
    display: collapsible ? (expanded ? "none" : "inherit") : "inherit",
  },

  ...(hasWarning
    ? {
        "& .MuiOutlinedInput-root:not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline":
          {
            border: (t: Theme) => `2px solid ${t.palette.warning.main}`,
            opacity: 1,
            display: "inherit",
          },
        "& .MuiInputLabel-root:not(.Mui-focused):not(.Mui-error)": {
          color: (t: Theme) => t.palette.warning.main,
        },
      }
    : null),

  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: (t: Theme) => `2px solid ${t.palette.success.main}`,
    opacity: 1,
    display: "inherit",
  },

  "& .MuiInputLabel-root": {
    color: (t: Theme) => t.palette.text.secondary,
    zIndex: 1,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: (t: Theme) => t.palette.success.main,
  },

  "& .MuiInputAdornment-root": { position: "relative", zIndex: 2 },

  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    border: (t: Theme) => `2px solid ${t.palette.error.main}`,
    opacity: 1,
    display: "inherit",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: (t: Theme) => t.palette.error.main,
  },
});

export const getHtmlInputSx = (
  collapsible: boolean,
  expanded: boolean,
): SxProps<Theme> => ({
  opacity: collapsible ? (expanded ? 1 : 0) : 1,
  transition: collapsible ? "opacity 150ms" : "none",
  maxHeight: HEIGHT,
});

export const inputAdornmentSx: SxProps<Theme> = {
  position: "relative",
  mr: 1,
  zIndex: 3,
};

export const iconButtonSx = (disabled = false): SxProps<Theme> => ({
  bgcolor: disabled ? "grey.500" : "grey.600",
  boxShadow: disabled ? "none" : "-4px 0px 6px -2px rgba(0, 0, 0, 0.4)",
  color: "common.white",
  borderRadius: "999px",
  height: 3 * HEIGHT,
  width: 3 * HEIGHT,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: disabled ? "default" : "pointer",
  lineHeight: 0,
  opacity: disabled ? 0.5 : 1,
  "&:hover": {
    bgcolor: disabled ? "grey.500" : "grey.700",
  },
});
