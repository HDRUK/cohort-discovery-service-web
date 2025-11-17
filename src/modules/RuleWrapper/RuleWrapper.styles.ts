import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";

export const containerSx = (
  isSelected: boolean,
  rest?: SxProps<Theme>
): SxProps<Theme> => ({
  border: 1,
  borderColor: isSelected ? "blue" : "transparent",
  p: 1,
  position: "relative",
  ...rest,
});

export const headerRowSx: SxProps<Theme> = {
  position: "relative",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  minHeight: 40,
};

export const dragButtonSx: SxProps<Theme> = {
  cursor: "grab",
  mt: 0.25,
};

export const dragIconSx = (isDragging: boolean): SxProps<Theme> => ({
  opacity: isDragging ? 0 : 1,
});

export const skeletonSx = (
  width: number | string = "100%",
  height: number | string = "100%"
): SxProps<Theme> => ({
  mx: "auto",
  width,
  height,
});

export const cardSx = (
  isSelected: boolean,
  valid: boolean
): SxProps<Theme> => ({
  p: 2,
  border: 1,
  borderColor: valid ? "black" : "warning.main",
  width: "100%",
  bgcolor: isSelected ? undefined : "white",
});

export const cardHeaderSx: SxProps<Theme> = {
  borderBottom: 1,
  borderColor: "divider",
  p: 0,
  m: 0,
  pb: 1,
};

export const cardActionsSx: SxProps<Theme> = {
  borderTop: 1,
  borderColor: "divider",
  p: 0,
  m: 0,
  pt: 1,
};

export const chipSx: SxProps<Theme> = {
  bgcolor: "white",
};

export const headerActionSx: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

export const selectedCaptionSx: SxProps<Theme> = {
  zIndex: 1,
  position: "absolute",
  left: "50%",
  bottom: 0,
  transform: "translateX(-50%)",
  px: 0.75,
  py: 0.25,
  lineHeight: 1,
  bgcolor: "blue",
  color: "white",
};
