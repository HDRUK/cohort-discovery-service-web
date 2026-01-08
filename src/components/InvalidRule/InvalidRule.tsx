import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Tooltip } from "@mui/material";

const InvalidRule = ({ reasons }: { reasons: string[] }) => (
  <Tooltip title={reasons.join(" ")}>
    <WarningAmberIcon color="warning" />
  </Tooltip>
);

export default InvalidRule;
