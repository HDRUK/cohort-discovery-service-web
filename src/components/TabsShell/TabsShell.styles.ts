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
};

export const tabHeaderSx: Sx = {
  bgcolor: "white",
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
    display: "none",
    top: 0,
    bottom: "auto",
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
