import theme from "@/config/theme";
import { Button, styled } from "@mui/material";

export const SupportList = styled("ul")(() => ({
  listStyle: "none",
  paddingLeft: 0,
  margin: 0,
}));

export const SupportButton = styled(Button)(() => ({
  height: 40,
  width: 160,
  position: "fixed",
  right: 15,
  bottom: 15,
  borderRadius: 4,
  zIndex: 9999,
  "&:hover": { background: theme.palette.yellowCustom?.main },
}));
