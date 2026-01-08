import { SxProps, Theme } from "@mui/material/styles";

type Sx = SxProps<Theme>;

export const rootSx: Sx = {
  display: "flex",
  flexDirection: "column",
  bgcolor: "background.default",
  height: "100%",
  minHeight: 0,
  overflow: "hidden",
};

export const tabSx: Sx = {
  minWidth: 200,
  minHeight: 20,
  p: 1,
};

export const tabHeaderSx: Sx = {
  bgcolor: "white",
  height: 40,
};

export const tabContentSx: Sx = {
  display: "flex",
  flexDirection: "column",
  px: 2,
  flex: 1,
  minHeight: 0,
};

export const tabListSx: Sx = {
  "& .MuiTabs-indicator": {
    top: 0,
    bottom: "auto",
    bgcolor: "currentColor",
    opacity: 0.2,
  },
};

export const tabPanelSx: Sx = {
  px: 0,
  py: 1,
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  "&[hidden]": {
    display: "none",
  },
};
