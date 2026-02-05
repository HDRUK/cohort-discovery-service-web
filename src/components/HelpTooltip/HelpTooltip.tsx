import { styled } from "@mui/material";
import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";

const HelpTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.tooltip?.main,
    color: theme.palette.common.white,
  },
}));

export default HelpTooltip;
