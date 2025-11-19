import { SxProps, Theme } from "@mui/material/styles";

export const getContainerSx =
  (
    collapsible: boolean,
    expanded: boolean,
    expandedWidth: number | string,
    collapsedWidth: number | string
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
  inputBgColor: string
): SxProps<Theme> => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: 100,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.23)",
    backgroundColor: inputBgColor,
    p: 0,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    zIndex: 0,
    borderTop: "none",
    borderLeftColor: "rgba(0,0,0,0.1)",
    borderRightColor: "rgba(0,0,0,0.1)",
    borderBottomColor: "rgba(0,0,0,0.23)",
    opacity: collapsible ? (expanded ? 1 : 0) : 1,
    transition: collapsible ? "opacity 150ms" : "none",
    display: collapsible ? (expanded ? "none" : "inherit") : "inherit",
  },
  "& .MuiInputAdornment-root": { position: "relative", zIndex: 2 },
  "& .MuiFormLabel-root": {
    zIndex: 1,
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    display: "inherit",
    opacity: 1,
    borderColor: (t: Theme) => t.palette.error.main,
  },
  "& .MuiOutlinedInput-root.Mui-error.Mui-disabled .MuiOutlinedInput-notchedOutline":
    {
      borderColor: (t: Theme) => t.palette.error.main,
    },
  "& .MuiInputLabel-root": {
    color: "text.secondary",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "text.secondary",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: (t: Theme) => t.palette.error.main,
  },
});

export const getHtmlInputSx = (
  collapsible: boolean,
  expanded: boolean
): SxProps<Theme> => ({
  opacity: collapsible ? (expanded ? 1 : 0) : 1,
  transition: collapsible ? "opacity 150ms" : "none",
});

export const inputAdornmentSx: SxProps<Theme> = {
  position: "relative",
  mr: 1,
  zIndex: 3,
};

export const iconButtonSx: SxProps<Theme> = {
  bgcolor: "grey.600",
  boxShadow: "-4px 0px 6px -2px rgba(0, 0, 0, 0.4)",
  color: "common.white",
  borderRadius: "999px",
  height: 40,
  width: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  lineHeight: 0,
  "&:hover": { bgcolor: "grey.700" },
};
