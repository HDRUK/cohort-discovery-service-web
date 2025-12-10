import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";

export const cardSx = (selected: boolean): SxProps<Theme> => ({
  border: 0,
  mx: "auto",
  width: "fit-content",
  minWidth: "100%",
  bgcolor: selected ? undefined : "transparent",
  "&:hover": {
    bgcolor: selected ? undefined : "highlight.main",
    cursor: "pointer",
  },
});

export const rootSx = (hidden: boolean): SxProps<Theme> => ({
  minHeight: 60,
  my: "auto",
  position: "relative",
  display: hidden ? "none" : "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  alignItems: "center",
  justifyContent: "center",
});

export const dividerSx =
  (valid: boolean): SxProps<Theme> =>
  (theme) => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    borderLeftWidth: 2,
    zIndex: 0,
    borderColor: valid ? theme.palette.divider : theme.palette.warning.main,
  });

export const chipSx: SxProps<Theme> = (theme) => ({
  position: "relative",
  bgcolor: "white",
  boxShadow: theme.shadows[2],
  zIndex: 1, // keep above the divider
});
