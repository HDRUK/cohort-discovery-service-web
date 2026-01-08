import { styled } from "@mui/material/styles";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

const CircularIconButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  borderRadius: 20,
  width: 36,
  height: 36,
  backgroundColor: theme.palette.highlight.main,
}));

export default CircularIconButton;
