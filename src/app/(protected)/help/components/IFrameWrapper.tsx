import { styled } from "@mui/material";

export const IFrameWrapper = styled("div")({
  position: "relative",
  overflow: "hidden",
  width: "100%",
  maxWidth: "700px",
  aspectRatio: "16 / 9",
  iframe: {
    width: "100%",
    height: "100%",
  },
});
